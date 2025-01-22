const { hash, compare } = require('bcrypt');
const AppError = require('../utils/AppError');

const sqliteConnection = require('../database/sqlite');

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = ?", [email]);

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    return response.status(201).json({ message: "Usuário criado com sucesso!" });
  }
}

module.exports = UsersController;

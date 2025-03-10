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

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user){
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este Email já está em uso");
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password){
      throw new AppError('vc precisa informar a senha antiga')
    }

    if(password && old_password){
      const checkPassword = await compare(old_password, user.password)

      if(!checkPassword){
        throw new AppError('A senha antiga não confere')
      }

      user.password = await hash(password, 8);
    }
    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`, 
      [user.name, user.email, user.password, user_id]
    )

    return response.json()
  }
}


module.exports = UsersController;

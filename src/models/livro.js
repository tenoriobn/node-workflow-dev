/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import db from '../db/dbconfig.js';

class Livro {
  constructor({
    id,
    titulo,
    paginas,
    editora_id,
    autor_id,
    created_at,
    updated_at,
  }) {
    this.id = id || null;
    this.titulo = titulo;
    this.paginas = paginas;
    this.editora_id = editora_id;
    this.autor_id = autor_id;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static async pegarLivros() {
    return db.select('*').from('livros');
  }

  static async pegarPeloId(id) {
    const resultado = await db.select('*').from('livros').where({ id });
    return resultado[0];
  }

  async criar() {
    const novoLivro = {
      titulo: this.titulo,
      paginas: this.paginas,
      editora_id: this.editora_id,
      autor_id: this.autor_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
    return db('livros').insert(novoLivro);
  }

  async atualizar(id) {
    // o update retorna a quantidade de rows atualizados e não o objeto do registro atualizado
    await db('livros')
      .where({ id })
      .update({ ...this, updated_at: new Date().toISOString() });

    return db.select('*').from('livros').where({ id });
  }

  static async excluir(id) {
    // o del retorna a quantidade de rows deletados
    return db('livros')
      .where({ id })
      .del();
  }

  async salvar() {
    // verificar se o id existe no banco
    // se não existir é create
    // se existir é update
    if (this.id) {
      const resultado = await this.atualizar(this.id);
      return resultado;
    }
    const resultado = await this.criar();
    return resultado;
  }
}

export default Livro;

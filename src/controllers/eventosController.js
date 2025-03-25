import Evento from '../models/evento.js';

class EventosController {
  static listarEventos = async (_, res) => {
    try {
      const resultado = await Evento.pegarEventos();
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static listarEventoPorId = async (req, res) => {
    const { params } = req;
    try {
      const resultado = await Evento.pegarPeloId(params.id);
      if (!resultado) {
        return res.status(404).json({ message: `id ${params.id} não encontrado` });
      }
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static cadastrarEvento = async (req, res) => {
    const { body } = req;
    const evento = new Evento(body);
    try {
      if (Object.keys(body).length === 0) {
        throw new Error('corpo da requisição vazio');
      }
      await evento.salvar(evento);
      return res.status(201).json({ message: 'evento criado!' });
    } catch (err) {
      if (err.message === 'corpo da requisição vazio') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json(err.message);
    }
  };

  static atualizarEvento = async (req, res) => {
    const { params } = req;
    const { body } = req;
    try {
      const eventoAtual = await Evento.pegarPeloId(params.id);
      if (!eventoAtual) {
        return res.status(404).json({ message: `id ${params.id} não encontrado` });
      }
      const novaEvento = new Evento({ ...eventoAtual, ...body });
      const resposta = await novaEvento.salvar(novaEvento);
      return res.status(200).json({ message: 'evento atualizado!', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static excluirEvento = async (req, res) => {
    const { params } = req;
    try {
      const eventoFoiDeletado = await Evento.excluir(params.id);
      if (!eventoFoiDeletado) {
        return res.status(404).json({ message: `Evento com id ${params.id} não encontrado!` });
      }
      return res.status(200).json({ message: 'evento excluído!' });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

export default EventosController;

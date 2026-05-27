const Pelicula = require('../modules/Pelicula');

class PeliculasService {
  async obtenerTodas() { return await Pelicula.findAll(); }
  async obtenerPorId(id) { return await Pelicula.findByPk(id); }
  async crear(datos) { return await Pelicula.create(datos); }
  async actualizar(id, datos) {
    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) return null;
    return await pelicula.update(datos);
  }
  async eliminar(id) {
    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) return false;
    await pelicula.destroy();
    return true;
  }
}

module.exports = new PeliculasService();
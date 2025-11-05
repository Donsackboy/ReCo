import React, { useState, useEffect } from 'react';
import './GestionarUsuarios.css';
// @ts-ignore: Dynamic import to avoid TS module error
let getUsuarios: any, updateUsuario: any, deleteUsuario: any;

import('../../../../api.js').then(api => {
  getUsuarios = api.getUsuarios;
  updateUsuario = api.updateUsuario;
  deleteUsuario = api.deleteUsuario;
});
import HeaderAdmin from '../../components/Header/HeaderAdmin';

interface Usuario {
  id: number;
  username: string;
  email: string;
  tipo_usuario: string;
  first_name?: string;
  last_name?: string;
  telefono?: string;
}

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const data = await getUsuarios(token);
        setUsuarios(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsuarios();
  }, []);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleEliminar = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteUsuario = async () => {
    if (confirmDeleteId === null) return;
    const usuario = usuarios.find(u => u.id === confirmDeleteId);
    if (usuario?.tipo_usuario === 'admin') {
      alert('No puedes eliminar usuarios tipo admin.');
      setConfirmDeleteId(null);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await deleteUsuario(confirmDeleteId, token);
      setUsuarios(usuarios.filter(u => u.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      alert('Error al eliminar usuario');
      setConfirmDeleteId(null);
    }
  };

  const cancelDeleteUsuario = () => {
    setConfirmDeleteId(null);
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEdit(usuario);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setUsuarioEdit(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleModalSave = async () => {
    if (usuarioEdit) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const data: any = {
          username: usuarioEdit.username,
          email: usuarioEdit.email,
          tipo_usuario: usuarioEdit.tipo_usuario,
          first_name: usuarioEdit.first_name,
          last_name: usuarioEdit.last_name,
          telefono: usuarioEdit.telefono,
        };
        if (newPassword || confirmPassword) {
          data.new_password = newPassword;
          data.confirm_password = confirmPassword;
        }
        const updated = await updateUsuario(usuarioEdit.id, data, token);
        setUsuarios(usuarios.map(u => u.id === usuarioEdit.id ? updated : u));
        setModalOpen(false);
        setUsuarioEdit(null);
        setNewPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        alert(err?.response?.data?.error || 'Error al editar usuario');
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    (u.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="usuarios-admin-page">
      <HeaderAdmin adminName="Admin" />
      <h2>Gestionar Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar usuario por nombre o email..."
        value={busqueda}
        onChange={handleBuscar}
        className="usuarios-busqueda"
      />
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo_usuario}</td>
              <td>
                <button className="btn-editar" onClick={() => handleEditar(usuario)}>Editar</button>
                {usuario.tipo_usuario !== 'admin' && (
                  <button className="btn-eliminar" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación de eliminación fuera de la tabla */}
      {confirmDeleteId !== null && (() => {
        const usuario = usuarios.find(u => u.id === confirmDeleteId);
        if (!usuario) return null;
        if (usuario?.tipo_usuario === 'admin') {
          return (
            <div className="modal-usuario-bg">
              <div className="modal-usuario" style={{ maxWidth: 400, textAlign: 'center' }}>
                <h3 style={{ color: '#c00', marginBottom: 16 }}>No puedes eliminar usuarios tipo admin</h3>
                <p>
                  El usuario <b>{usuario.username}</b> (<span style={{color:'#555'}}>{usuario.email}</span>) es administrador y no puede ser eliminado.<br />
                </p>
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-editar" style={{ padding: '8px 20px', background: '#eee', color: '#333', borderRadius: 6, fontWeight: 600 }} onClick={cancelDeleteUsuario}>Cerrar</button>
                </div>
              </div>
            </div>
          );
        }
        // Modal normal para usuarios no admin
        return (
          <div className="modal-usuario-bg">
            <div className="modal-usuario" style={{ maxWidth: 400, textAlign: 'center' }}>
              <h3 style={{ color: '#c00', marginBottom: 16 }}>¿Eliminar usuario?</h3>
              <p>
                ¿Estás seguro que deseas eliminar a <b>{usuario?.username}</b> (<span style={{color:'#555'}}>{usuario?.email}</span>)?<br />Esta acción no se puede deshacer.
              </p>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
                <button
                  className="btn-eliminar"
                  style={{ padding: '8px 20px', background: '#c00', color: '#fff', borderRadius: 6, fontWeight: 600 }}
                  onClick={confirmDeleteUsuario}
                >Eliminar</button>
                <button className="btn-editar" style={{ padding: '8px 20px', background: '#eee', color: '#333', borderRadius: 6, fontWeight: 600 }} onClick={cancelDeleteUsuario}>Cancelar</button>
              </div>
            </div>
          </div>
        );
      })()}

      {modalOpen && usuarioEdit && (
          <div className="modal-usuario-bg">
            <div className="modal-usuario">
              <h3>Editar Usuario</h3>
              <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <label>Usuario:
                  <input
                    type="text"
                    value={usuarioEdit.username}
                    onChange={e => setUsuarioEdit({ ...usuarioEdit, username: e.target.value })}
                  />
                </label>
                <label>Email:
                  <input
                    type="email"
                    value={usuarioEdit.email}
                    onChange={e => setUsuarioEdit({ ...usuarioEdit, email: e.target.value })}
                  />
                </label>
                {usuarioEdit.tipo_usuario !== 'admin' && (
                  <label>Tipo:
                    <select
                      value={usuarioEdit.tipo_usuario}
                      onChange={e => setUsuarioEdit({ ...usuarioEdit, tipo_usuario: e.target.value })}
                    >
                      <option value="default">Usuario</option>
                      <option value="refugio">Refugio</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                )}
                <label>Nombre:
                  <input
                    type="text"
                    value={usuarioEdit.first_name || ''}
                    onChange={e => setUsuarioEdit({ ...usuarioEdit, first_name: e.target.value })}
                  />
                </label>
                <label>Apellido:
                  <input
                    type="text"
                    value={usuarioEdit.last_name || ''}
                    onChange={e => setUsuarioEdit({ ...usuarioEdit, last_name: e.target.value })}
                  />
                </label>
                <label>Teléfono:
                  <input
                    type="text"
                    value={usuarioEdit.telefono || ''}
                    onChange={e => setUsuarioEdit({ ...usuarioEdit, telefono: e.target.value })}
                  />
                </label>
                <label>Nueva contraseña:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                  />
                </label>
                <label>Confirmar contraseña:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                  />
                </label>
              </form>
              <div className="modal-usuario-actions" style={{ marginTop: 24, gridColumn: '1/3', display: 'flex', gap: 16, justifyContent: 'center' }}>
                <button className="btn-editar" onClick={handleModalSave}>Guardar</button>
                <button className="btn-eliminar" onClick={handleModalClose}>Cancelar</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default GestionarUsuarios;


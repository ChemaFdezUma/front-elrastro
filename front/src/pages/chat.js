import React from 'react';
import Navbar from '../components/Navbar';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import UserImage from '../media/user.jpg';
import '../css/chat.css';

const Chat = () => {
    const [mensajes, setMensajes] = useState([]);
    const idRemitente = useParams().idRemitente;
    const idDestinatario = useParams().idDestinatario;
    const idProducto = useParams().idProducto;
    const [nuevoMensaje, setNuevoMensaje] = useState('');

    useEffect(() => {
        console.log(idRemitente, idProducto, idDestinatario);
        cargarMensajes();
      }, [idProducto, idRemitente, idDestinatario]);
    
      const cargarMensajes = () => {
        console.log(idProducto, idRemitente, idDestinatario)
        Axios.get(`http://localhost:5010/mensajes/${idProducto}/${idRemitente}/${idDestinatario} `)
          .then(response => {
            console.log(response.data);
            if (response.data !== null) {
              setMensajes(response.data);
            }
          })
          .catch(error => {
            console.error('Error al obtener datos del backend:', error);
          });
      };

    const enviarMensaje = () => {
        Axios.post(`http://localhost:5010/mensajes`, {
            remitente: idRemitente,
            destinatario: idDestinatario,
            texto: nuevoMensaje,
            fechaEnvio: Date.now(),
            productoId: idProducto,
        })
          .then(response => {
            cargarMensajes();
            setNuevoMensaje('');
          })
          .catch(error => {
            console.error('Error al enviar mensaje:', error);
          });
      };
  
      return (
        <div>
          <Navbar />
          <div className="containerChat">
            <div className="mensajes">
              {mensajes.length > 0 ? (
                mensajes.map((mensaje, index) => (
                  <div key={index} className={mensaje.remitente === idRemitente ? 'recibido' : 'enviado'}>
                    {mensaje.texto}
                  </div>
                ))
              ) : (
                <p>No hay mensajes.</p>
              )}
            </div>
            <div className="nuevo-mensaje">
              <textarea
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe tu mensaje..."
              />
              <button onClick={enviarMensaje}>Enviar</button>
            </div>
          </div>
        </div>
      );
    };
    
    export default Chat;
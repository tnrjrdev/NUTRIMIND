import React, { useState, useEffect, useRef } from 'react';
import { notificacoesService, type Notificacao } from '../../services/notificacoesService';
import { useNavigate } from 'react-router-dom';

export function NotificationBell() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCount();
    // Poll every 30 seconds for unread count
    const interval = setInterval(carregarCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const carregarCount = async () => {
    try {
      const count = await notificacoesService.getCountNaoLidas();
      setUnreadCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      try {
        const data = await notificacoesService.getNotificacoes();
        setNotificacoes(data.content);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleNotificacaoClick = async (notificacao: Notificacao) => {
    if (!notificacao.lida) {
      try {
        await notificacoesService.marcarComoLida(notificacao.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotificacoes(notificacoes.map(n => n.id === notificacao.id ? { ...n, lida: true } : n));
      } catch (e) {
        console.error(e);
      }
    }
    
    setIsOpen(false);
    if (notificacao.linkDestino) {
      navigate(notificacao.linkDestino);
    }
  };

  const handleMarcarTodasLidas = async () => {
    try {
      await notificacoesService.marcarTodasComoLidas();
      setUnreadCount(0);
      setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:text-green-600 focus:outline-none transition-colors rounded-full hover:bg-green-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-800">Notificações</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarcarTodasLidas}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notificacoes.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Nenhuma notificação.
              </div>
            ) : (
              notificacoes.map(notificacao => (
                <div 
                  key={notificacao.id} 
                  onClick={() => handleNotificacaoClick(notificacao)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notificacao.lida ? 'bg-green-50/30' : ''}`}
                >
                  <p className={`text-sm ${!notificacao.lida ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {notificacao.mensagem}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notificacao.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

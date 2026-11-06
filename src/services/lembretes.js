
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export async function solicitarPermissao() {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  let permission = await LocalNotifications.checkPermissions();

  if (permission.display !== 'granted') {
    permission = await LocalNotifications.requestPermissions();
  }

  return permission.display === 'granted';
}

export async function agendarLembrete(id, titulo, mensagem, data) {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  const permitido = await solicitarPermissao();

  if (!permitido) {
    throw new Error('Permissão para notificações não concedida.');
  }

  const horario = new Date(data);

  if (horario.getTime() <= Date.now()) {
    throw new Error('Escolha uma data futura.');
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: titulo,
        body: mensagem,
        schedule: {
          at: horario,
          allowWhileIdle: true
        },
        extra: {
          reminderId: id
        }
      }
    ]
  });

  return id;
}

export async function listarLembretes() {
  if (!Capacitor.isNativePlatform()) {
    return [];
  }

  const resultado = await LocalNotifications.getPending();

  return resultado.notifications;
}

export async function cancelarLembrete(id) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await LocalNotifications.cancel({
    notifications: [{ id }]
  });
}

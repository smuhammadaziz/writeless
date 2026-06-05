import * as Notifications from "expo-notifications";

/** Alerts for notes-ready only — recording uses Live Activity / media control, not banners. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureRecordingNotificationSetup(): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;
}

export async function scheduleNotesReadyNotification(
  title: string,
  body: string,
  noteId: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { screen: `/note/${noteId}` },
    },
    trigger: null,
  });
}

export function addRecordingNotificationListener(
  onOpen: (screen: string) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as { screen?: string };
    if (typeof data?.screen === "string") {
      onOpen(data.screen);
    }
  });
}

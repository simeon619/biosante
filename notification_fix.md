# Guide de Dépannage des Notifications

Si les notifications ne s'affichent pas, suivez ces étapes :

## 1. Configuration de l'URL Backend
Assurez-vous que votre fichier `.env.local` contient l'URL correcte de votre API :
```bash
NEXT_PUBLIC_API_URL=http://votre-url-ngrok.ngrok-free.dev
# OU en local
NEXT_PUBLIC_API_URL=http://localhost:3333
```
> [!IMPORTANT]
> Changez cette valeur si vous utilisez ngrok pour que le frontend puisse contacter le backend.

## 2. État des Services
Vérifiez que les services suivants tournent :
- **Redis** : Indispensable pour la file d'attente Bull.
- **Transmit** : Assurez-vous que le serveur AdonisJS est démarré.

## 3. Autorisations Navigateur
Les notifications utilisent l'API Web Notifications.
- Vérifiez que vous avez autorisé les notifications pour le domaine concerné.
- Essayez de rafraîchir la page pour redemander la permission.

## 4. Test Manuel
Vous pouvez déclencher une notification de test en ouvrant ce lien dans votre navigateur (une fois connecté en admin) :
`[Backend URL]/api/admin/test-notification`

Si tout est bien configuré, un toast apparaîtra immédiatement sur votre dashboard admin.

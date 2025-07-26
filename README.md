# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.




Schema for the app:
### Posts
- `id` (uuid, PK)
- `author` (unique)
- `title` (text)
- `content` (text)
- `tags` (text[])
- `created_at` (timestamp)

### Tag Preferences
- `user_id` (uuid, PK)
- `preferred_tags` (text[])




## Personalization Logic
- When the user signs in, they select their preferred tags
- These tags are saved to their profile (or a separate `user_tags` table)
- The "For You" feed filters posts that match the user's tags (using overlaps)
- The Global Feed shows all posts




QUESTION:-
If you had to scale this app to 1 million users in India, what would you change, prioritize, or redesign?

- Firstly, we could move to a custom Backend Server, probably written in GoLang or TS(Node.js), which would provide with better performance and tailored scaling.

- We could also use an in-memory database like Redis, which would be a good fit for our use case and would act as the cache layer.

- We could also use a CDN like cloudFront from AWS, which would ensure super-low latency and for images/videos.
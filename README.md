# Whatsapp BOT By Seaavey Team

## 📌 About

[Whatsapp BOT](https://github.com/seaavey/Whatsapp-BOT) By [Seaavey Team](https://github.com/seaavey) is an open-source WhatsApp bot that automates messages and enhances your chat experience. This project is built for developers who want to create their own WhatsApp automation using simple and efficient code.

## ⚡ Features

- 🤖 Automated message responses
- 📂 Easy-to-use source code
- 🔧 Customizable commands
- 🚀 Fast and lightweight
- 🔒 Secure and reliable
- 📊 Logs and analytics support
- 🔄 Auto-reconnect for stable uptime

## 🛠️ Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/seaavey/Whatsapp-BOT
   cd Whatsapp-BOT
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up configuration**

   - change name `configuration.js.example` to `configuration.js`
   - fill in the required information

4. **Run the bot**
   ```sh
   npm start
   ```

## 🎯 Usage

- Start the bot and scan the QR code using WhatsApp Web.
- Send commands to the bot and receive automated responses.
- Customize the bot by modifying the source code.
- Monitor logs to track bot activity.

## 📚 Documentation

```javascript
// Example usage
export const name = "testing"
export const command = ["test"] // or same as command
export const category = "test"
export const usage = "<prefix>test" // optional
export const desc = "testing" // optional
export const isGroup = false // optional, only group
export const isAdmin = false // optional, only admin
export const isBotAdmin = false // optional, only bot admin
export const isOwner = false // optional, only query

export async function run(m, { sock }) {
  // Your code here
}
```

### Declaration

```typescript
import { ExtendedWASocket, Messages } from "../../services/Socket.js" // it's socket interface, why not use wa-socket? because wa-socket is not compatible with this project

export interface Commands {
  name: string
  command: string[] | string
  category: string
  usage?: string
  desc?: string
  isGroup?: boolean
  isAdmin?: boolean
  isBotAdmin?: boolean
  isOwner?: boolean
  run: (m: Messages, { sock, store }: { sock: ExtendedWASocket; store: any }) => Promise<void>
}
```

## 🤝 Contribution Guidelines

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make improvements and commit your changes.
4. Submit a pull request.

## 📄 License

This project is open-source and available under the MIT License.

## 🙏 Thanks To

- **Seaavey Team** - For development and support
- [**API Providers**]("services/api.js) - For providing the necessary APIs
- **Open-source Contributors** - For improving this project
- **All Users & Testers** - For feedback and suggestions
- **Node.js & NPM Community** - For providing essential tools
- **Contributors** - For their valuable contributions

## Donations

If you find this project useful and want to support us, consider making a donation:

- [Saweria](https://saweria.co/Seaavey)

Thank you for your support!

## 📞 Contact Us

For support or inquiries, reach out to us:

- 🌐 [Website](https://seaavey.biz.id)
- ✉️ Email: seaavey@gmail.com
- 📢 Follow us on [Whatsapp Channel](https://whatsapp.com/channel/0029Vb49mcTEgGfJRWTyuz35)

---

Made with ❤️ by **Seaavey Team**

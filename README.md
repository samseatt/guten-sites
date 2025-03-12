# Guten Sites

Guten Sites is the project responsible for serving published websites created using Guten Ink. It ensures that each website has its unique domain or subdomain and serves the site content in a scalable, efficient, and customizable manner. This project is distinct from **Guten Portal**, which is responsible for site creation and management.

## 🚀 Features
- **Serve Published Websites**: Hosts static and dynamic content for published sites.
- **Nginx Integration**: Uses Nginx for routing custom domains and subdomains.
- **Custom Theming**: Each website is served with its defined theme and styles.
- **S3 Image Hosting**: Supports serving images and other assets from AWS S3.
- **SEO & Performance Optimized**: Ensures fast and accessible page loads.

## 📂 Project Structure
```
guten-sites/
│── src/
│   ├── app/
│   │   ├── [site_name]/
│   │   │   ├── layout.tsx  # Layout for each served site
│   │   │   ├── page.tsx    # Landing page for a site
│   │   │   ├── [section_name]/
│   │   │   │   ├── page.tsx  # Section-level navigation
│   │   │   │   ├── [page_name]/
│   │   │   │   │   ├── page.tsx  # Individual pages
│   │   ├── assets/  # Static assets (e.g., logos, default favicon)
│   ├── components/  # Reusable UI components
│   ├── lib/         # API & utilities
│   ├── styles/      # Global styles
│── public/          # Public assets (e.g., site-specific favicons)
│── nginx/           # Nginx configurations
│── docker/          # Docker deployment setup
│── package.json
│── tsconfig.json
│── README.md
```

## 🛠️ Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **pnpm** or **npm**
- **Docker & Docker Compose** (for containerized deployment)
- **AWS S3 Bucket** (for storing site assets like images)

### Local Development
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/guten-sites.git
   cd guten-sites
   ```
2. Install dependencies:
   ```sh
   pnpm install  # or npm install
   ```
3. Start the development server:
   ```sh
   pnpm dev  # or npm run dev
   ```
4. Visit `http://localhost:3001/site_name/section_name/page_name` to view a sample site.

### Deployment
#### 1️⃣ **Run with Docker**
```sh
docker-compose up -d
```
#### 2️⃣ **Configure Nginx** (For Custom Domains)
Modify `nginx.conf` to map domains to the correct site routes:
```nginx
server {
    listen 80;
    server_name mywebsite.com;

    location / {
        proxy_pass http://localhost:3001/site_name/;
    }
}
```
Reload Nginx:
```sh
sudo systemctl reload nginx
```

## 🔗 API Integration
Guten Sites interacts with **Guten Crust** to fetch published content. API examples:
```sh
# Fetch site details
GET /guten/published/sites/{site_name}

# Fetch section details
GET /guten/published/sections/{section_name}?site={site_name}

# Fetch published page
GET /guten/published/pages/{page_name}?site={site_name}
```

## 🎨 Theming & Customization
Each site can define its:
- **Color theme**: Background, typography, and component styles.
- **Favicon**: Site-specific icon stored in `public/{site_name}/favicon.ico`.
- **Typography & Layout**: Configurable via `src/styles/themes.ts`.

## 📦 Static Asset Hosting
- **Images & Files**: Stored in **AWS S3** under `s3://guten-sites/{site_name}/assets/`.
- **Favicon & Logos**: Retrieved from site settings in the database.

## 🔐 Security Considerations
- **HTTPS with Let's Encrypt**: SSL certificates for custom domains.
- **Content Delivery via CloudFront**: Optional CDN support.
- **Rate Limiting & Caching**: To prevent abuse and optimize speed.

## 🏗️ Future Enhancements
- **Multisite Scaling**: Kubernetes support for handling thousands of sites.
- **User-uploaded media**: Direct image uploads via admin panel.
- **Enhanced SEO tools**: Automatic sitemap & metadata generation.
- **Built-in analytics**: Track visitor engagement per site.

## 🤝 Contributing
Want to improve Guten Sites? Feel free to open issues & PRs!

```sh
git checkout -b feature/new-improvement
git commit -m "Added new feature"
git push origin feature/new-improvement
```

## 📄 License
MIT License © 2024 Guten Ink

---
**Guten Sites**: Powering the web, one site at a time.


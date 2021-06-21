# xmlsitemap-seo

Universal CLI for sitemap.xml File Generator for SEO

## Installation

### npm

```shell
npm i xmlsitemap-seo
```

### yarn

```shell
yarn add xmlsitemap-seo
```

## Usage

Step 1: Create `xmlsitemap.config.js` file in your root directory.

Step 2: Add your URLs and last modified date in to the config file.

Example

```diff
    module.exports = {
      policy: {
        urls: [
          {
            url: "/enterprise/orgs-terms",
            lastMod: "2017-10-06",
          },
          {
            url: "//www.example.com",
            lastMod: "2017-10-06",
          },
        ],
      },
    };
```

Step 3: Run CLI as `npx xmlsitemap-seo` in your termminal.

Step 4: Provide directory path for the `sitemap.xml` file `(Ex: './public', './')`.

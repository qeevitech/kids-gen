import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          primary: "hsl(var(--brand-primary))",
          secondary: "hsl(var(--brand-secondary))",
          tertiary: "hsl(var(--brand-tertiary))",
        },
        "bg-light": "hsl(var(--background-light))",
        "bg-white": "hsl(var(--background-white))",
        "bg-dark": "hsl(var(--background-dark))",
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-light": "hsl(var(--text-light))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        // Playful and Child-friendly
        "comic-neue": ["Comic Neue", "cursive"],
        bubblegum: ["Bubblegum Sans", "cursive"],
        schoolbell: ["Schoolbell", "cursive"],
        "patrick-hand": ["Patrick Hand", "cursive"],
        sniglet: ["Sniglet", "cursive"],
        gloria: ["Gloria Hallelujah", "cursive"],
        architect: ["Architects Daughter", "cursive"],
        indie: ["Indie Flower", "cursive"],
        amatic: ["Amatic SC", "cursive"],
        fredoka: ["Fredoka", "cursive"],
        balsamiq: ["Balsamiq Sans", "cursive"],
        "gochi-hand": ["Gochi Hand", "cursive"],
        "short-stack": ["Short Stack", "cursive"],
        "crafty-girls": ["Crafty Girls", "cursive"],
        dekko: ["Dekko", "cursive"],
        "marker-felt": ["Marker Felt", "cursive"],
        andika: ["Andika", "sans-serif"],
        mali: ["Mali", "cursive"],
        chilanka: ["Chilanka", "cursive"],
        gaegu: ["Gaegu", "cursive"],

        // Clean and Modern
        poppins: ["Poppins", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],

        // Decorative
        pacifico: ["Pacifico", "cursive"],
        "dancing-script": ["Dancing Script", "cursive"],
        "great-vibes": ["Great Vibes", "cursive"],
        satisfy: ["Satisfy", "cursive"],

        // Readable Serif
        merriweather: ["Merriweather", "serif"],
        "playfair-display": ["Playfair Display", "serif"],
        lora: ["Lora", "serif"],
        "crimson-text": ["Crimson Text", "serif"],

        // Handwriting
        caveat: ["Caveat", "cursive"],
        kalam: ["Kalam", "cursive"],
        "shadows-light": ["Shadows Into Light", "cursive"],
        "permanent-marker": ["Permanent Marker", "cursive"],

        // Cute
        baloo: ["Baloo 2", "cursive"],
        comfortaa: ["Comfortaa", "cursive"],
        "varela-round": ["Varela Round", "sans-serif"],
        mochiy: ["Mochiy Pop One", "sans-serif"],
        itim: ["Itim", "cursive"],
        dongle: ["Dongle", "sans-serif"],
        "gamja-flower": ["Gamja Flower", "cursive"],

        // Fancy/Elegant
        cinzel: ["Cinzel", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        "pinyon-script": ["Pinyon Script", "cursive"],
        "alex-brush": ["Alex Brush", "cursive"],
        tangerine: ["Tangerine", "cursive"],
        "rouge-script": ["Rouge Script", "cursive"],
        allura: ["Allura", "cursive"],

        // Vintage/Retro
        "abril-fatface": ["Abril Fatface", "cursive"],
        lobster: ["Lobster", "cursive"],
        sacramento: ["Sacramento", "cursive"],
        "berkshire-swash": ["Berkshire Swash", "cursive"],
        "fugaz-one": ["Fugaz One", "cursive"],
        monoton: ["Monoton", "cursive"],
        righteous: ["Righteous", "cursive"],

        // Futuristic/Modern
        orbitron: ["Orbitron", "sans-serif"],
        audiowide: ["Audiowide", "cursive"],
        exo: ["Exo 2", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        syncopate: ["Syncopate", "sans-serif"],
        "chakra-petch": ["Chakra Petch", "sans-serif"],
        teko: ["Teko", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui"],
        body: ["var(--font-inter)", "system-ui"],
        accent: ["var(--font-gaegu)", "cursive"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(to bottom, hsl(var(--gradient-start)), hsl(var(--gradient-end)))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

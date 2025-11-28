const express = require("express");
const app = express();
const path = require("path");

// Configuration du moteur de template EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware pour servir les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Middleware pour vérifier les heures de travail (lundi à vendredi, 9h à 17h)
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const day = now.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  const hour = now.getHours(); // Heure actuelle (0-23)
  // Vérifier si nous sommes en semaine (lundi=1 à vendredi=5)
  // et pendant les heures de travail (9h à 17h)
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
    next(); // Continuer vers la route suivante
  } else {
    // Si en dehors des heures de travail, afficher un message
    res.status(403).send(`
            <html>
                <head>
                    <title>Hors heures de travail</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                        h1 { color: #d32f2f; }
                    </style>
                </head>
                <body>
                    <h1>Site temporairement indisponible</h1>
                    <p>Notre site est accessible uniquement pendant les heures de travail :</p>
                    <p>Lundi à Vendredi, de 9h à 17h</p>
                    <p>Merci de votre compréhension.</p>
                </body>
            </html>
        `);
  }
};

// Appliquer le middleware de vérification des heures à toutes les routes
app.use(checkWorkingHours);

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.render("home");
});

// Route pour la page "Nos services"
app.get("/services", (req, res) => {
  res.render("services");
});

// Route pour la page "Contactez-nous"
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

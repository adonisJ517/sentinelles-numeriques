# Airport Hub - Backend

Backend Spring Boot pour l'application mobile Airport Hub, fournissant des services de gestion d'aéroport.

## 📋 Description

Ce projet est le backend d'une application de gestion d'aéroport, développé avec Spring Boot. Il fournit une API RESTful pour gérer les opérations liées aux aéroports, aux vols, aux passagers et aux réservations.

## 🛠 Technologies

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL**
- **Spring Security**
- **Maven**

## 📁 Structure du Projet

```
src/main/java/com/airport/hub/
├── AirportHubApplication.java     # Point d'entrée de l'application
├── config/                       # Configuration Spring
├── controller/                   # Contrôleurs REST
├── model/                        # Entités JPA
├── repository/                   # Interfaces de repository
├── service/                      # Couche service
└── security/                     # Configuration de sécurité
```

## 🚀 Prérequis

- JDK 17 ou supérieur
- Maven 3.6.3 ou supérieur
- PostgreSQL 13 ou supérieur

## ⚙️ Configuration

1. **Base de données** :
   - Créez une base de données PostgreSQL nommée `airport_hub`
   - Configurez les identifiants dans `application.properties`

2. **Variables d'environnement** :
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/airport_hub
   SPRING_DATASOURCE_USERNAME=votre_utilisateur
   SPRING_DATASOURCE_PASSWORD=votre_mot_de_passe
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```

## 🏃‍♂️ Exécution

1. Clonez le dépôt
2. Configurez la base de données
3. Exécutez :
   ```bash
   mvn spring-boot:run
   ```
4. L'application sera disponible sur : `http://localhost:8080`

## 🧪 Tests

Pour exécuter les tests :
```bash
mvn test
```

## 🔒 Sécurité

L'application utilise Spring Security pour l'authentification et l'autorisation. Assurez-vous de configurer correctement les rôles et les autorisations.

## 📝 API Documentation

La documentation de l'API est disponible via Swagger UI à l'adresse :
```
http://localhost:8080/swagger-ui.html
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ✉️ Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement.

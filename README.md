# 📝 Task Manager

**Task Manager** es una aplicación web para gestionar tareas personales. Permite al usuario agregar, editar, eliminar y visualizar tareas pendientes. La autenticación se maneja mediante JWT.

---

## 🚀 Tecnologías utilizadas

### Backend
- Java 17
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Flyway

## Frontend
- HTML, CSS, JavaScript
## 🔐 Autenticación
El backend requiere un **token JWT** para acceder a las rutas protegidas. El login devuelve el token, que el frontend guarda en `localStorage`.
---

## ✅ Funcionalidades

- [x] Login con autenticación JWT
- [x] Listado de tareas
- [x] Crear tareas
- [x] Editar tareas
- [x] Eliminar tareas
- [x] Alerta cuando el token expira

## Estructura del proyecto
---
```
task-manager/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── example/
│   │   │   │           ├── controller/
│   │   │   │           ├── model/
│   │   │   │           ├── repository/
│   │   │   │           ├── security/
│   │   │   │           ├── service/
│   │   │   │           └── TaskManagerApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application.properties-dev
│   │   │       └── db/
│   │   │           └── migration/
│   ├── pom.xml
│   
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   └── login.html
│   ├── src/
│   │   ├── css/
│   │   │   │── style.css
│   │   │   │── style.css 
│   │   ├── js/
│   │   │   ├── color.js
│   │   │   ├── login.js
│   │   │   ├── tasks.js
│   │   │   ├── utils.js
│   │       └── register.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
├── .gitignore
```

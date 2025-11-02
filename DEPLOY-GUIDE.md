# Guía de Deploy - EPC Check en Coolify

## 📋 Información del Proyecto

- **Repositorio**: `git@github.com:dcozargrafia/epc-check.git`
- **Rama principal**: `main`
- **Servidor**: VPS Axarnet (185.176.8.202)
- **Dominio**: https://epc-check.cozardev.info
- **Stack**: Node.js 18 + Express
- **Gestión**: Coolify v4
- **Acceso público**: Túnel Cloudflare

---

## 🚀 Cómo hacer cambios en el código

### Flujo normal de desarrollo
```bash
# 1. Hacer cambios en tu código local
nano server.js  # o el archivo que necesites

# 2. Probar localmente (opcional pero recomendado)
npm install
node server.js
# Abrir http://localhost:4000 para verificar

# 3. Commit de los cambios
git add .
git commit -m "Descripción clara del cambio"

# 4. Push a GitHub
git push origin main

# 5. Deploy automático en Coolify
# Coolify detecta el push y despliega automáticamente
# Ver progreso en: http://185.176.8.202:8000
```

### ✅ El deploy es AUTOMÁTICO
Una vez haces `git push`, Coolify:
1. Detecta el cambio en GitHub
2. Hace pull del código
3. Construye la imagen Docker
4. Despliega el nuevo contenedor
5. La app se actualiza en ~2-3 minutos

---

## 🔧 Deploy manual (si auto-deploy falla)

Si necesitas forzar un deploy:

1. Accede a Coolify: http://185.176.8.202:8000
2. Ve a Projects → epc-check
3. Click en **"Redeploy"**
4. Espera a que termine (verás los logs)

---

## 📝 Archivos importantes

### `Dockerfile`
Define cómo se construye la aplicación:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

**⚠️ No modificar** a menos que cambies dependencias o comando de inicio.

### `package.json`
Define dependencias del proyecto.

**Si añades nuevas dependencias:**
```bash
npm install nueva-dependencia --save
git add package.json package-lock.json
git commit -m "Add nueva-dependencia"
git push origin main
```

### Carpeta `public/`
Contiene el frontend (HTML, CSS, JS).
**Importante**: Debe estar en el repositorio Git para que se despliegue.

---

## 🐛 Troubleshooting

### La app no se actualiza después del push

**Verificar logs de deploy:**
```bash
# En el VPS
ssh root@185.176.8.202
docker logs t08swk8owg8s4cgcs00gcow0
```

O en Coolify: Projects → epc-check → Logs

### Error 502 Bad Gateway

**Verificar que el contenedor está corriendo:**
```bash
docker ps | grep t08swk8owg8s4cgcs00gcow0
```

**Verificar que el servidor responde:**
```bash
curl http://10.0.1.7:4000
```

**Si no responde, reiniciar túnel:**
```bash
systemctl restart cloudflared
```

### La IP del contenedor cambió

**Obtener nueva IP:**
```bash
docker inspect t08swk8owg8s4cgcs00gcow0 | grep \"IPAddress\"
```

**Actualizar túnel:**
```bash
nano /etc/cloudflared/config.yml
# Cambiar la IP en la línea de epc-check
systemctl restart cloudflared
```

---

## 🔐 Acceso al servidor

### SSH al VPS
```bash
ssh root@185.176.8.202
```

### Coolify Dashboard
- URL: http://185.176.8.202:8000
- Usuario: (tu email)

### GitHub
- Repo: https://github.com/dcozargrafia/epc-check
- Acceso: SSH configurado con clave `~/.ssh/github_axarnet`

---

## 📊 Comandos útiles

### Ver logs en tiempo real
```bash
docker logs -f t08swk8owg8s4cgcs00gcow0
```

### Ver estado del contenedor
```bash
docker ps | grep epc
```

### Reiniciar la aplicación
En Coolify: Click en "Restart"

O manualmente:
```bash
docker restart t08swk8owg8s4cgcs00gcow0
```

### Ver uso de recursos
```bash
docker stats t08swk8owg8s4cgcs00gcow0
```

---

## ⚙️ Configuración técnica

### Contenedor
- **Nombre**: `t08swk8owg8s4cgcs00gcow0` (consistente)
- **IP interna**: `10.0.1.7`
- **Puerto interno**: `4000`
- **Puerto host**: `4040`
- **Red Docker**: `coolify`

### Túnel Cloudflare
- **Archivo config**: `/etc/cloudflared/config.yml`
- **Servicio**: `cloudflared.service`
- **Endpoint**: `http://10.0.1.7:4000`

### DNS
- **Registro**: CNAME `epc-check` → túnel Cloudflare
- **No modificar** - ya está configurado

---

## 🎯 Checklist de deploy

- [ ] Código funcionando localmente
- [ ] Cambios commiteados
- [ ] Push a GitHub realizado
- [ ] Deploy automático completado (ver Coolify)
- [ ] App accesible en https://epc-check.cozardev.info
- [ ] Funcionalidad verificada

---

## 📞 Soporte

**En caso de problemas:**
1. Revisar logs en Coolify
2. Verificar estado del contenedor
3. Comprobar túnel Cloudflare
4. Contactar con DevOps si persiste

---

**Última actualización**: 2 de noviembre de 2025
**Mantenedor**: Daniel Cozar

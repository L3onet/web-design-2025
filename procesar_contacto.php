<?php
/**
 * Procesador de formulario de contacto con Quill Editor
 * Archivo: procesar_contacto.php
 */

// Configuración de cabeceras para JSON
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Inicializar respuesta
$response = [
    'success' => false,
    'message' => ''
];

try {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    // ============================================
    // CONFIGURACIÓN
    // ============================================
    
    // Email del destinatario (cambiar por tu email)
    $email_destino = 'tu-email@ejemplo.com';
    
    // Asunto del email
    $email_asunto = 'Nuevo mensaje desde formulario de contacto';
    
    // ============================================
    // SANITIZACIÓN Y VALIDACIÓN DE DATOS
    // ============================================
    
    // Obtener y sanitizar datos del formulario
    $nombre = isset($_POST['nombre']) ? sanitizar($_POST['nombre']) : '';
    $email = isset($_POST['email']) ? sanitizar($_POST['email']) : '';
    $telefono = isset($_POST['telefono']) ? sanitizar($_POST['telefono']) : '';
    $asunto = isset($_POST['asunto']) ? sanitizar($_POST['asunto']) : '';
    
    // El mensaje viene con HTML de Quill, necesita tratamiento especial
    $mensaje_html = isset($_POST['mensaje']) ? $_POST['mensaje'] : '';
    $mensaje_texto = strip_tags($mensaje_html); // Versión texto plano
    $mensaje_html_limpio = limpiarHTML($mensaje_html); // HTML sanitizado
    
    $terminos = isset($_POST['terminos']) ? $_POST['terminos'] : '';
    
    // Validaciones
    $errores = [];
    
    if (empty($nombre)) {
        $errores[] = 'El nombre es obligatorio';
    }
    
    if (empty($email)) {
        $errores[] = 'El email es obligatorio';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'El email no es válido';
    }
    
    if (empty($asunto)) {
        $errores[] = 'El asunto es obligatorio';
    }
    
    if (empty($mensaje_texto) || strlen(trim($mensaje_texto)) < 10) {
        $errores[] = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    if (empty($terminos)) {
        $errores[] = 'Debes aceptar los términos y condiciones';
    }
    
    // Si hay errores, devolverlos
    if (!empty($errores)) {
        throw new Exception(implode('. ', $errores));
    }
    
    // ============================================
    // PREPARAR EMAIL
    // ============================================
    
    // Traducir el asunto seleccionado
    $asuntos_traducidos = [
        'informacion' => 'Solicitud de información',
        'soporte' => 'Soporte técnico',
        'ventas' => 'Consulta de ventas',
        'sugerencia' => 'Sugerencia',
        'otro' => 'Otro'
    ];
    
    $asunto_texto = isset($asuntos_traducidos[$asunto]) ? $asuntos_traducidos[$asunto] : $asunto;
    
    // Crear el cuerpo del email en HTML
    $email_cuerpo = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-container {
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 30px;
            }
            .field {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            .field-label {
                font-weight: bold;
                color: #667eea;
                margin-bottom: 8px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .field-value {
                color: #333;
                font-size: 15px;
            }
            .mensaje-content {
                background: white;
                padding: 15px;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
                margin-top: 8px;
            }
            .mensaje-content p {
                margin: 0 0 10px 0;
            }
            .mensaje-content p:last-child {
                margin-bottom: 0;
            }
            .mensaje-content strong {
                font-weight: 600;
            }
            .mensaje-content em {
                font-style: italic;
            }
            .mensaje-content u {
                text-decoration: underline;
            }
            .mensaje-content ol,
            .mensaje-content ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .mensaje-content li {
                margin: 5px 0;
            }
            .mensaje-content a {
                color: #667eea;
                text-decoration: underline;
            }
            .footer {
                background: #333;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 12px;
            }
            .footer p {
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>📧 Nuevo Mensaje de Contacto</h1>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="field-label">Nombre:</div>
                    <div class="field-value">' . htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') . '</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value"><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></div>
                </div>
                
                ' . (!empty($telefono) ? '
                <div class="field">
                    <div class="field-label">Teléfono:</div>
                    <div class="field-value">' . htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8') . '</div>
                </div>
                ' : '') . '
                
                <div class="field">
                    <div class="field-label">Asunto:</div>
                    <div class="field-value">' . htmlspecialchars($asunto_texto, ENT_QUOTES, 'UTF-8') . '</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Mensaje:</div>
                    <div class="mensaje-content">
                        ' . $mensaje_html_limpio . '
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Formulario de Contacto</strong></p>
                <p>Fecha y hora: ' . date('d/m/Y H:i:s') . '</p>
                <p>IP del remitente: ' . obtenerIP() . '</p>
            </div>
        </div>
    </body>
    </html>
    ';
    
    // Configurar cabeceras del email
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $email,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // ============================================
    // ENVIAR EMAIL
    // ============================================
    
    $email_enviado = mail(
        $email_destino,
        '=?UTF-8?B?' . base64_encode($email_asunto . ' - ' . $asunto_texto) . '?=',
        $email_cuerpo,
        implode("\r\n", $headers)
    );
    
    if (!$email_enviado) {
        throw new Exception('Error al enviar el email. Por favor intenta nuevamente.');
    }
    
    // ============================================
    // GUARDAR EN BASE DE DATOS (OPCIONAL)
    // ============================================
    
    // Descomenta y configura si quieres guardar en base de datos
    /*
    $conexion = new mysqli('localhost', 'usuario', 'password', 'base_datos');
    
    if ($conexion->connect_error) {
        throw new Exception('Error de conexión a la base de datos');
    }
    
    $conexion->set_charset('utf8mb4');
    
    $stmt = $conexion->prepare(
        "INSERT INTO contactos (nombre, email, telefono, asunto, mensaje_html, mensaje_texto, ip, fecha) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
    );
    
    $ip = obtenerIP();
    $stmt->bind_param('sssssss', $nombre, $email, $telefono, $asunto, $mensaje_html_limpio, $mensaje_texto, $ip);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al guardar en la base de datos');
    }
    
    $stmt->close();
    $conexion->close();
    */
    
    // ============================================
    // GUARDAR EN ARCHIVO LOG (OPCIONAL)
    // ============================================
    
    $log_data = [
        'fecha' => date('Y-m-d H:i:s'),
        'nombre' => $nombre,
        'email' => $email,
        'telefono' => $telefono,
        'asunto' => $asunto_texto,
        'mensaje_texto' => $mensaje_texto,
        'mensaje_html' => $mensaje_html_limpio,
        'ip' => obtenerIP()
    ];
    
    file_put_contents(
        'contactos.log',
        json_encode($log_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n" . str_repeat('-', 80) . "\n\n",
        FILE_APPEND | LOCK_EX
    );
    
    // ============================================
    // RESPUESTA EXITOSA
    // ============================================
    
    $response['success'] = true;
    $response['message'] = '¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente. Te responderemos pronto.';
    
} catch (Exception $e) {
    // Manejo de errores
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    
    // Log de errores
    error_log('Error en formulario de contacto: ' . $e->getMessage());
}

// Devolver respuesta JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE);

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Sanitiza una cadena de texto básica
 * @param string $data Texto a sanitizar
 * @return string Texto sanitizado
 */
function sanitizar($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Limpia y sanitiza HTML del editor Quill
 * Permite solo etiquetas seguras y elimina atributos peligrosos
 * @param string $html HTML a limpiar
 * @return string HTML limpio
 */
function limpiarHTML($html) {
    // Lista de etiquetas permitidas (las que usa Quill)
    $etiquetas_permitidas = '<p><br><strong><em><u><s><ol><ul><li><a><h1><h2><h3><h4><h5><h6><blockquote><pre><code><span>';
    
    // Limpiar HTML manteniendo solo etiquetas permitidas
    $html_limpio = strip_tags($html, $etiquetas_permitidas);
    
    // Eliminar atributos peligrosos (onclick, onerror, etc.)
    $html_limpio = preg_replace('/<(\w+)[^>]*?(on\w+\s*=|javascript:|vbscript:)[^>]*?>/i', '<$1>', $html_limpio);
    
    // Limpiar atributos de estilo inline peligrosos
    $html_limpio = preg_replace('/style\s*=\s*["\'][^"\']*expression\s*\([^"\']*["\']/', '', $html_limpio);
    
    // Convertir entidades HTML para seguridad adicional
    $html_limpio = preg_replace_callback(
        '/<a\s+[^>]*href\s*=\s*["\']([^"\']+)["\'][^>]*>/i',
        function($matches) {
            $url = filter_var($matches[1], FILTER_SANITIZE_URL);
            return '<a href="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '" target="_blank" rel="noopener noreferrer">';
        },
        $html_limpio
    );
    
    return $html_limpio;
}

/**
 * Obtiene la IP real del cliente
 * @return string IP del cliente
 */
function obtenerIP() {
    $ip = '';
    
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // Validar IP
    $ip = filter_var($ip, FILTER_VALIDATE_IP);
    
    return $ip ? $ip : 'Desconocida';
}

/**
 * Función alternativa usando PHPMailer (más confiable)
 * Descomenta para usar en lugar de la función mail()
 */
/*
function enviarEmailConPHPMailer($destinatario, $asunto, $cuerpo, $remitente_email, $remitente_nombre) {
    require 'vendor/autoload.php'; // Composer autoload
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Cambiar según tu proveedor
        $mail->SMTPAuth   = true;
        $mail->Username   = 'tu-email@gmail.com'; // Tu email
        $mail->Password   = 'tu-contraseña'; // Tu contraseña
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        
        // Remitente y destinatario
        $mail->setFrom($remitente_email, $remitente_nombre);
        $mail->addAddress($destinatario);
        $mail->addReplyTo($remitente_email, $remitente_nombre);
        
        // Contenido del email
        $mail->isHTML(true);
        $mail->Subject = $asunto;
        $mail->Body    = $cuerpo;
        $mail->AltBody = strip_tags($cuerpo);
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error al enviar email: {$mail->ErrorInfo}");
        return false;
    }
}
*/
?>
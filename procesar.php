<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        $nombre = htmlspecialchars($_POST['nombre'] ?? '');
        $mensaje = htmlspecialchars($_POST['mensaje'] ?? '');
        $genero = htmlspecialchars($_POST['genero'] ?? '');
        $pais = htmlspecialchars($_POST['pais'] ?? '');
        
        // Para checkboxes (array) - asegurar que siempre sea array
        $intereses = $_POST['intereses'] ?? [];
        
        // Si por alguna razón llega como string, convertir a array
        if (!is_array($intereses)) {
            $intereses = [$intereses];
        }
        
        echo "<h2>Datos recibidos:</h2>";
        echo "<p><strong>Nombre:</strong> $nombre</p>";
        echo "<p><strong>Mensaje:</strong> $mensaje</p>";
        echo "<p><strong>Genero:</strong> $genero</p>";
        
        if(!empty($intereses)) {
            echo "<p><strong>Intereses:</strong></p><ul>";
            foreach($intereses as $interes){
                echo "<li>" . htmlspecialchars($interes) . "</li>";
            }
            echo "</ul>";
        } else {
            echo "<p><strong>Intereses:</strong> Ningún interés seleccionado</p>";
        }
        
        echo "<p><strong>País:</strong> $pais</p>";
    } else {
        echo "<p>No se recibieron datos</p>";
    }
?>
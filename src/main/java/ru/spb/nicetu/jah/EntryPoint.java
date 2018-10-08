package ru.spb.nicetu.jah;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;
import java.net.InetSocketAddress;

import javax.swing.*;

import com.sun.net.httpserver.HttpServer;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.web.WebView;

public class EntryPoint {

    public static void main(String[] args) throws IOException {
        int port = 9182;

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/help/", new StaticHandler("/help", "webapp"));
        server.start();

        JFXPanel jfxPanel = new JFXPanel();

        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame();
            frame.add(jfxPanel, BorderLayout.CENTER);
            frame.setSize(new Dimension(1000, 800));
            frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
            frame.addWindowListener(new WindowAdapter() {
                @Override
                public void windowClosing(WindowEvent e) {
                    server.stop(0);
                }
            });
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);

        });

        String url = "http://localhost:" + port + "/help/index.html";

        Platform.runLater(() -> {
            WebView webView = new WebView();
            jfxPanel.setScene(new Scene(webView));
            webView.getEngine().load(url);
        });

        System.out.println("url = " + url);


    }
}

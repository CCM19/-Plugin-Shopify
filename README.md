# CCM19 Integration

Das CCM19-Integrations-Plugin fügt ohne viel aufwand Ihren CCM19 Code-Schnipsel in das Shopify Shop Theme ein. 

## Installation

Die kostenlose Installation wird über den Shopify store ausgeführt.

## Anwendung

Einfach Ihren CCM19 Code-Schnipsel aus dem Backend in das Textfeld einfügen und bestätigen. 

## Support

Sollte das Plugin das Script nicht wie gewünscht einfügen kann es an einer fehlerhaften eingabe liegen. Sollte das nicht der Fall sein 
wenden Sie sich bitte an den Support mit der entsprechenden Fehlernachricht aus der Browserkonsole.
Gibt es keinen Fehler in 
der Browserkonsole geben oder ist dieser nicht eindeutig dann schicken Sie bitte die error logs aus ccm19-integration/web/logs/app.log an
den Support mit einer kurzen Beschreibung des Fehlers.

## FAQ

Warum braucht das Plugin Zugriff auf Themes?

DasPlugin braucht Zugriff auf Themes um den Code-Schnipsel in den Head des Main Themes einzufügen.

Gibt es Konflikte mit anderen Plugins?

Zum derzeitigen Zeitpunkt ist uns kein Konflikt bekannt, jedoch kann es aufgrund der natur des Plugins zu konflikten mit 
anderen Plugins kommen, welche das Verhalten von <Script> und oder <head> manipulieren.

Gibt es einschränkungen welche Themes benutzt werden können?

Es dürfen nur Themes benutzt werden die einen <head> im Main Template haben. Sollte es keinen <head> haben dann wird der Code-Schnipsel am Ende des <body> eingefügt, um eine vorübergehende funktionalität sicherzustellen.






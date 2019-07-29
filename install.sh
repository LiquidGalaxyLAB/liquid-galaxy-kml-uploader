read -p "KML server IP: " serverIp
read -p "KML server Port: " serverPort
sudo tee -a /etc/environment << EOM
KMLSERVERIP="$serverIp"
KMLSERVERPORT="$serverPort"
EOM

export /etc/environment

#ADD the kml viewsync into my places to auto load
sudo sed -i 's/<\/kml>//' ~/earth/kml/master/myplaces.kml
sudo sed -i 's/<\/Document>//' ~/earth/kml/master/myplaces.kml
cat >> ~/earth/kml/master/myplaces.kml << EOM
	<Folder>
    <name>KML API SYNC</name>
    <open>1</open>
		<NetworkLink>
			<flyToView>5</flyToView>
			<Link>
				<href>http://$serverIp:$serverPort/kml/viewsync
			</href>
			<refreshMode>onInterval</refreshMode>
			<refreshInterval>1</refreshInterval>
			</Link>
		</NetworkLink>
	</Folder>
</Document>
</kml>
EOM

for lg in $LG_FRAMES; do
  scp ~/earth/kml/master/myplaces.kml lg@$lg:~/earth/kml/master/myplaces.kml
exit 0

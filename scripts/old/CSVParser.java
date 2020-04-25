import java.io.*;
import java.io.File;
import java.io.FileWriter;
import java.util.TreeSet;
public class CSVParser {
    public static void main(String[] args) throws IOException {
        BufferedReader csvReader = new BufferedReader(new FileReader("MillionPlaylistsFixed.txt"));
        String row = csvReader.readLine();
        row = csvReader.readLine();
        String DDL = "";
        TreeSet<String> ids = new TreeSet<String>();
        while (row != null) {
                String[] data = row.split("\",\"");
//                if (data.length < 9) {
//                    for (int i = 0; i < data.length; i++) {
//                        System.out.println(data[i]);
//                    }
//                    row = csvReader.readLine();
//                    continue;
//                }
                if (!ids.contains(data[6])) {
                    ids.add(data[6]);
                    DDL += "INSERT INTO Million_Playlists(playlist_id,playlist_name) VALUES (" + data[6] + "," + data[8] +");" + "\n";
                    
                }
                DDL += "INSERT INTO In_Playlist(playlist_id,artist,title) VALUES (" + data[6] + "," + data[4] + "," + data[3] + ");" + "\n";
                row = csvReader.readLine();
        }
        System.out.println(ids.size());
        csvReader.close();
        File myObj = new File("ddlcommands.txt");
        FileWriter myWriter = new FileWriter(myObj);
        myWriter.write(DDL);
        myWriter.close();
    }
}
import java.io.*;
import java.io.File;
import java.io.FileWriter;
import java.util.TreeSet;
public class CSVParser2 {
    public static void main(String[] args) throws IOException {
        BufferedReader csvReader = new BufferedReader(new FileReader("global.csv"));
        String row = csvReader.readLine();
        //row = csvReader.readLine();
        String DDL = "";
        TreeSet<String> ids = new TreeSet<String>();
        while (row != null) {
                String[] data = row.split(",");
                if (data.length == 22) {
                    DDL += "INSERT INTO Top_100_Songs(artist,title,energy,liveliness,danceability,day,month,year,position) VALUES (" +
                data[2] + "," + data[1] + "," + data[10] + "," + data[17] + "," + 
                            data[9] + "," + data[7] + "," + data[6] + "," + data[5] + "," + data[0] +");" + "\n";
                }
                // if (!ids.contains(data[6])) {
                //     ids.add(data[6]);
                //     DDL += "INSERT INTO Million_Playlists(playlist_id,playlist_name) VALUES (" + data[6] + "," + data[8] +");" + "\n";
                    
                // }
                //DDL += "INSERT INTO In_Playlist(playlist_id,artist,title) VALUES (" + data[6] + "," + data[4] + "," + data[3] + ");" + "\n";
                row = csvReader.readLine();
        }
//        System.out.println(ids.size());
        csvReader.close();
        File myObj = new File("top_songs_ddl.txt");
        FileWriter myWriter = new FileWriter(myObj);
        myWriter.write(DDL);
        myWriter.close();
    }
}

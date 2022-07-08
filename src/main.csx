using System;
using System.Collections.Generic;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using System.IO;

using AssistantSeika;

public class Startup
{
    private static WCFClient Client = new WCFClient();

    private static async Task<string> ToJson(object input)
    {
        var serializer = new DataContractJsonSerializer(input.GetType());
        var stream = new MemoryStream();
        serializer.WriteObject(stream, input);
        stream.Position = 0;
        var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }

    public async Task<object> Version(dynamic input)
    {
        return Client.Version();
    }

    public async Task<object> ProductScan(dynamic input)
    {
        Client.ProductScan();
        return true;
    }

    public async Task<object> BootHttpService(dynamic input)
    {
        Client.BootHttpService();
        return true;
    }

    public async Task<object> AvatorList(dynamic input)
    {
        return await ToJson(Client.AvatorList());
    }

    public async Task<object> AvatorList2(dynamic input)
    {
        return await ToJson(Client.AvatorList2());
    }

    public async Task<object> AvatorListDetail2(dynamic input)
    {
        return await ToJson(Client.AvatorListDetail2());
    }

    public async Task<object> GetDefaultParams2(dynamic input)
    {
        var cid = (int)input;
        return await ToJson(Client.GetDefaultParams2(cid));
    }

    public async Task<object> GetCurrentParams2(dynamic input)
    {
        var cid = (int)input;
        return await ToJson(Client.GetCurrentParams2(cid));
    }

    public async Task<object> Talk(dynamic input)
    {
        int cid = (int)input.cid;
        List<string> talktext = new List<string>();
        string filepath = (string)input.filepath;
        Dictionary<string, decimal> effects = new Dictionary<string, decimal>();
        Dictionary<string, decimal> emotions = new Dictionary<string, decimal>();

        try
        {
            object[] talktext_array = (object[])input.talktext;
            foreach (string i in talktext_array)
            {
                talktext.Add(i);
            }
        }
        catch (System.Exception)
        {
            talktext.Add((string)input.talktext);
        }

        object[] effects_array = (object[])input.effects;
        object[] emotions_array = (object[])input.emotions;

        foreach (object[] i in effects_array)
        {
            effects.Add((string)i[0], Convert.ToDecimal(i[1]));
        }

        foreach (object[] i in emotions_array)
        {
            emotions.Add((string)i[0], Convert.ToDecimal(i[1]));
        }

        if (filepath == "")
        {
            return Client.Talk(cid, talktext.ToArray(), effects, emotions);
        }
        else
        {
            return Client.Talk(cid, talktext.ToArray(), filepath, effects, emotions);
        }
    }

    public async Task<object> TalkAsync(dynamic input)
    {
        int cid = (int)input.cid;
        List<string> talktext = new List<string>();
        Dictionary<string, decimal> effects = new Dictionary<string, decimal>();
        Dictionary<string, decimal> emotions = new Dictionary<string, decimal>();

        object[] talktext_array = (object[])input.talktext;
        object[] effects_array = (object[])input.effects;
        object[] emotions_array = (object[])input.emotions;

        foreach (string i in talktext_array)
        {
            talktext.Add(i);
        }

        foreach (object[] i in effects_array)
        {
            effects.Add((string)i[0], Convert.ToDecimal(i[1]));
        }

        foreach (object[] i in emotions_array)
        {
            emotions.Add((string)i[0], Convert.ToDecimal(i[1]));
        }

        Client.TalkAsync(cid, talktext.ToArray(), effects, emotions);
        return true;
    }
}

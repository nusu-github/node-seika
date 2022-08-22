using System;
using System.ServiceModel;
using System.Collections.Generic;
using System.Runtime.Serialization.Json;
using System.Threading;
using System.Threading.Tasks;
using System.IO;

public class Startup
{
    private ChannelFactory<IScAPIs> Channel;

    private IScAPIs api;

    private static async Task<string> ToJson(object input)
    {
        var serializer = new DataContractJsonSerializer(input.GetType());
        var stream = new MemoryStream();
        serializer.WriteObject(stream, input);
        stream.Position = 0;
        var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }

    private void Init()
    {
        string BaseAddr = "net.pipe://localhost/EchoSeika/CentralGate/ApiEntry";
        Channel = new ChannelFactory<IScAPIs>(new NetNamedPipeBinding(), new EndpointAddress(BaseAddr));
        api = Channel.CreateChannel();

        while (Channel.State != CommunicationState.Opened)
        {
            Thread.Sleep(100);
        }
    }

    public async Task<object> Main(dynamic input)
    {
        string method = "";
        dynamic args = "";
        dynamic result;

        if (input.method != null)
        {
            method = (string)input.method;
        }
        if (input.args != null)
        {
            args = (dynamic)input.args;
        }

        if (Channel == null)
        {
            Init();
        }

        switch (method)
        {
            case "Version":
                {
                    result = api.Verson();
                    return result;
                }
            case "ProductScan":
                {
                    api.ProductScan();
                    return true;
                }
            case "BootHttpService":
                {
                    api.BootHttpService();
                    return true;
                }
            case "AvatorList":
                {
                    result = await ToJson(api.AvatorList());
                    return result;
                }
            case "AvatorList2":
                {
                    result = await ToJson(api.AvatorList2());
                    return result;
                }
            case "AvatorListDetail2":
                {
                    result = await ToJson(api.AvatorListDetail2());
                    return result;
                }
            case "GetDefaultParams2":
                {
                    var cid = (int)args.cid;
                    result = await ToJson(api.GetDefaultParams2(cid));
                    return result;
                }
            case "GetCurrentParams2":
                {
                    var cid = (int)args.cid;
                    result = await ToJson(api.GetCurrentParams2(cid));
                    return result;
                }
            case "Talk":
                {
                    int cid = (int)args.cid;
                    List<string> talktext = new List<string>();
                    string filepath = (string)args.filepath;
                    Dictionary<string, decimal> effects = new Dictionary<string, decimal>();
                    Dictionary<string, decimal> emotions = new Dictionary<string, decimal>();

                    try
                    {
                        object[] talktext_array = (object[])args.talktext;
                        foreach (string i in talktext_array)
                        {
                            talktext.Add(i);
                        }
                    }
                    catch (System.Exception)
                    {
                        talktext.Add((string)args.talktext);
                    }

                    object[] effects_array = (object[])args.effects;
                    object[] emotions_array = (object[])args.emotions;

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
                        return api.Talk2(cid, talktext.ToArray(), "", effects, emotions);
                    }
                    else
                    {
                        return api.Talk2(cid, talktext.ToArray(), filepath, effects, emotions);
                    }
                }
            case "TalkAsync":
                {
                    int cid = (int)args.cid;
                    List<string> talktext = new List<string>();
                    Dictionary<string, decimal> effects = new Dictionary<string, decimal>();
                    Dictionary<string, decimal> emotions = new Dictionary<string, decimal>();

                    try
                    {
                        object[] talktext_array = (object[])args.talktext;
                        foreach (string i in talktext_array)
                        {
                            talktext.Add(i);
                        }
                    }
                    catch (System.Exception)
                    {
                        talktext.Add((string)args.talktext);
                    }

                    object[] effects_array = (object[])args.effects;
                    object[] emotions_array = (object[])args.emotions;

                    foreach (object[] i in effects_array)
                    {
                        effects.Add((string)i[0], Convert.ToDecimal(i[1]));
                    }

                    foreach (object[] i in emotions_array)
                    {
                        emotions.Add((string)i[0], Convert.ToDecimal(i[1]));
                    }

                    api.TalkAsync2(cid, talktext.ToArray(), effects, emotions);
                    return true;
                }
            default:
                {
                    Channel.Close();
                    return "";
                }
        }
    }
}

// 引用元 https://hgotoh.jp/wiki/doku.php/documents/voiceroid/assistantseika/interface/wcf/wcf-001
[ServiceContract(SessionMode = SessionMode.Required)]
public interface IScAPIs
{
    [OperationContract]
    string Verson();

    [OperationContract]
    void ProductScan();

    [OperationContract]
    void BootHttpService();

    [OperationContract]
    Dictionary<int, string> AvatorList();

    [OperationContract]
    Dictionary<int, Dictionary<string, string>> AvatorList2();

    [OperationContract]
    Dictionary<int, Dictionary<string, string>> AvatorListDetail2();

    [OperationContract]
    Dictionary<string, Dictionary<string, Dictionary<string, decimal>>> GetDefaultParams2(int cid);

    [OperationContract]
    Dictionary<string, Dictionary<string, Dictionary<string, decimal>>> GetCurrentParams2(int cid);

    [OperationContract]
    void ResetParams2(int cid);

    [OperationContract]
    double Talk(int cid, string talktext, string filepath, Dictionary<string, decimal> effects, Dictionary<string, decimal> emotions);

    [OperationContract]
    double Talk2(int cid, string[] talktexts, string filepath, Dictionary<string, decimal> effects, Dictionary<string, decimal> emotions);

    [OperationContract]
    void TalkAsync(int cid, string talktext, Dictionary<string, decimal> effects, Dictionary<string, decimal> emotions);

    [OperationContract]
    void TalkAsync2(int cid, string[] talktexts, Dictionary<string, decimal> effects, Dictionary<string, decimal> emotions);
}

export class SpotifyRequest {

    public static readonly SEARCH: number = 1;
    public static readonly FETCH_TRACKS: number = 2;

    private RequestType: number;
    private RequestValue: string;

    public constructor(type: number, value: string)
    {
        this.RequestType = type;
        this.RequestValue = value;  
    }

    public GetType(): string
    {
        return SpotifyRequest.fetchTypeText(this.RequestType);
    }

    public GetValue(): string
    {
        return this.RequestValue;
    }

    private static fetchTypeText(type: number): string
    {
        switch(type)
        {
            case SpotifyRequest.SEARCH:
                return "Search";
            case SpotifyRequest.FETCH_TRACKS:
                return "FetchTracks";
            default:
        }
    }

}
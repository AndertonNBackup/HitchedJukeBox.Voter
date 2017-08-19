import * as logger from 'morgan';
import * as socketIo from "socket.io";

import { UserFunctions } from './user';

import { SpotifyTrack } from '../models/shared/core/spotify-track';

import { NowPlayingRequest } from '../models/shared/now-playing/now-playing-request';
import { NowPlayingTrackRequest } from '../models/shared/now-playing/now-playing-track-request';
import { NowPlayingAlbumRequest } from '../models/shared/now-playing/now-playing-album-request';
import { NowPlayingCommandRequest } from '../models/shared/now-playing/now-playing-command-request';
import { NowPlayingResponse } from '../models/shared/now-playing/now-playing-response';

import { NowPlayingItem } from '../models/shared/now-playing/now-playing-item';

export class NowPlayingService {
    public static readonly SERVICE_PREFIX: string = "NowPlaying";

    private appPrefix: string;

    private io: SocketIO.Server;

    private MainQueue: Array<NowPlayingItem>;

    public static bootstrap(): NowPlayingService {
        return new NowPlayingService().bootstrap();
    }

    constructor() {
        this.config();
    }

    private bootstrap(): NowPlayingService {
        return this;
    }

    private config(): void {
        console.log('Now Playing Service Initiated!');

        this.MainQueue = new Array<any>();
    }

    public register_hooks(io: SocketIO.Server, socket: SocketIO.Socket, appPrefix: string): void {
        this.io = io;
        this.appPrefix = appPrefix;
        socket.on(
            NowPlayingRequest.fetchCommandHook(appPrefix, NowPlayingService.SERVICE_PREFIX),
            (nowPlayingRequest: NowPlayingRequest): any => {

                let user = UserFunctions.getUser(socket.id);

                nowPlayingRequest = NowPlayingRequest.FromObject(nowPlayingRequest);

                switch (nowPlayingRequest.GetType()) {
                    case NowPlayingRequest.NP_REQUEST_ALBUM:
                        this.process_album_request(socket, nowPlayingRequest.GetData() as NowPlayingAlbumRequest);
                        break;
                    case NowPlayingRequest.NP_REQUEST_TRACK:
                        this.process_track_request(socket, nowPlayingRequest.GetData() as NowPlayingTrackRequest);
                        break;
                    case NowPlayingRequest.NP_REQUEST_COMMAND:
                        this.process_command_request(socket, nowPlayingRequest.GetData() as NowPlayingCommandRequest);
                        break;
                    default:
                }
            });
    }

    private process_track_request(socket: SocketIO.Socket, trackRequest: NowPlayingTrackRequest): void {
        trackRequest = NowPlayingTrackRequest.FromObject(trackRequest);
        let spotifyTrack: SpotifyTrack = SpotifyTrack.fromJSON(trackRequest);
        
        let user = UserFunctions.getUser(socket.id);
        this.MainQueue.push(new NowPlayingItem(
            NowPlayingItem.NP_TRACK,
            spotifyTrack.GetID(),
            spotifyTrack.GetName(),
            spotifyTrack.GetArtistName(),
            spotifyTrack.GetImage(),
            user.name
        ));
        let nowPlayingResponse: NowPlayingResponse = new NowPlayingResponse(this.MainQueue);
        socket.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
        socket.broadcast.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
    }

    private process_command_request(socket: SocketIO.Socket, commandRequest: NowPlayingCommandRequest): void {
        commandRequest = NowPlayingCommandRequest.FromObject(commandRequest);
        console.log(commandRequest);
        switch (commandRequest.GetType()) {
            case NowPlayingCommandRequest.NPC_REFRESH:
                this.process_reresh_request(socket);
                break;
            case NowPlayingCommandRequest.NPC_CLEAR:
                this.process_clear_request(socket);
                break;
            case NowPlayingCommandRequest.NPC_VOTE:
                this.process_upvote_request(socket, commandRequest);
                break;
            case NowPlayingCommandRequest.NPC_DOWNVOTE:
                this.process_downvote_request(socket, commandRequest);
                break;
            default:
        }
    }

    private process_reresh_request(socket: SocketIO.Socket): void
    {
        let nowPlayingResponse: NowPlayingResponse = new NowPlayingResponse(this.MainQueue);
        socket.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
    }

    private process_upvote_request(socket: SocketIO.Socket, commandRequest: NowPlayingCommandRequest): void
    {
        let nowPlayingItem: NowPlayingItem = this.MainQueue.find(item => item.getId() === commandRequest.GetIndex());
        let user = UserFunctions.getUser(socket.id);
        nowPlayingItem.AddVote(user.name);
        this.MainQueue = this.MainQueue.sort((itemA, itemB) => {
            return itemA.GetVoteCount() > itemB.GetVoteCount() ? -1 : itemA.GetVoteCount() == itemB.GetVoteCount() ? 0 : 1;
        });
        let nowPlayingResponse: NowPlayingResponse = new NowPlayingResponse(this.MainQueue);
        socket.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
        socket.broadcast.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
    }

    private process_downvote_request(socket: SocketIO.Socket, commandRequest: NowPlayingCommandRequest): void
    {
        let nowPlayingItem: NowPlayingItem = this.MainQueue.find(item => item.getId() === commandRequest.GetIndex());
        let user = UserFunctions.getUser(socket.id);
        nowPlayingItem.RemoveVote(user.name);
        if(nowPlayingItem.GetVoteCount() <= 0) {
            this.MainQueue = this.MainQueue.filter(item => item.getId() !== nowPlayingItem.getId());
        }
        this.MainQueue = this.MainQueue.sort((itemA, itemB) => {
            return itemA.GetVoteCount() > itemB.GetVoteCount() ? -1 : itemA.GetVoteCount() == itemB.GetVoteCount() ? 0 : 1
        });       
        let nowPlayingResponse: NowPlayingResponse = new NowPlayingResponse(this.MainQueue);
        socket.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
        socket.broadcast.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
    }

    private process_clear_request(socket: SocketIO.Socket): void
    {
        this.MainQueue = new Array<any>();
        let nowPlayingResponse: NowPlayingResponse = new NowPlayingResponse(this.MainQueue);
        socket.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
        socket.broadcast.emit(
            NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
            nowPlayingResponse
        );
    }

    private process_album_request(socket: SocketIO.Socket, albumRequest: NowPlayingAlbumRequest): void {
        // albumRequest = NowPlayingAlbumRequest.FromObject(albumRequest);
        // this.MainQueue.push({ 'id': "NewAlbumItem" });
        // let nowPlayingResponse: NowPlayingResponse = new NowPlayingResponse(this.MainQueue);

        // console.log("Emitting Event");
        // socket.emit(
        //     NowPlayingResponse.fetchNowPlayingResponseHook(this.appPrefix, NowPlayingService.SERVICE_PREFIX),
        //     new NowPlayingResponse(this.MainQueue)
        // );
    }
}
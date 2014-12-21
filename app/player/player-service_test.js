describe("Player service -", function() {
    'use strict';

    var player, firstSong, secondSong, thirdSong, newSong;
    beforeEach(function() {
        module('jamstash.player.service');

        inject(function (_player_) {
            player = _player_;
        });
    });

    describe("Given that I have 3 songs in my playing queue", function() {

        beforeEach(function() {
            firstSong = {
                id: 6726,
                name: 'Guarauno',
                artist: 'Carlyn Pollack',
                album: 'Arenig'
            };
            secondSong = {
                id: 2452,
                name: 'Michoacan',
                artist: 'Lura Jeppsen',
                album: 'dioptrical'
            };
            thirdSong = {
                id: 574,
                name: 'Celtidaceae',
                artist: 'Willard Steury',
                album: 'redux'
            };
            player.queue = [firstSong, secondSong, thirdSong];
            newSong = {
                id: 3573,
                name: 'Tritopatores',
                artist: 'Alysha Rocher',
                album: 'uncombinably'
            };
        });

        describe("when I call nextTrack", function() {
            beforeEach(function() {
                spyOn(player, "play");
            });

            it("and no song is playing, it plays the first song", function() {
                player.nextTrack();

                expect(player.playingIndex).toBe(0);
                expect(player.play).toHaveBeenCalledWith(player.queue[0]);
            });

            it("and the first song is playing, it plays the second song", function() {
                player.playingIndex = 0;

                player.nextTrack();

                expect(player.playingIndex).toBe(1);
                expect(player.play).toHaveBeenCalledWith(player.queue[1]);
            });

            it("and the last song is playing, it does nothing", function() {
                player.playingIndex = 2;

                player.nextTrack();

                expect(player.playingIndex).toBe(2);
                expect(player.play).not.toHaveBeenCalled();
            });
        });

        describe("when I call previousTrack", function() {
            beforeEach(function() {
                spyOn(player, "play");
            });

            it("and no song is playing, it plays the first song", function() {
                player.previousTrack();

                expect(player.playingIndex).toBe(0);
                expect(player.play).toHaveBeenCalledWith(player.queue[0]);
            });

            it("and the first song is playing, it restarts the first song", function() {
                player.playingIndex = 0;

                player.previousTrack();

                expect(player.playingIndex).toBe(0);
                expect(player.play).toHaveBeenCalledWith(player.queue[0]);
            });

            it("and the last song is playing, it plays the second song", function() {
                player.playingIndex = 2;

                player.previousTrack();

                expect(player.playingIndex).toBe(1);
                expect(player.play).toHaveBeenCalledWith(player.queue[1]);
            });
        });

        it("when I call playFirstSong, it plays the first song and updates the playing index", function() {
            spyOn(player, "play");

            player.playFirstSong();

            expect(player.playingIndex).toBe(0);
            expect(player.play).toHaveBeenCalledWith(player.queue[0]);
        });

        it("when I play the second song, it finds its index in the playing queue and updates the playing index", function() {
            player.play(secondSong);
            expect(player.playingIndex).toBe(1);
        });

        it("when I play a song that isn't in the playing queue, the next song will be the first song of the playing queue", function() {
            player.play(newSong);
            expect(player.playingIndex).toBe(-1);
        });

        it("When I call emptyQueue, it empties the playing queue", function() {
            player.emptyQueue();
            expect(player.queue).toEqual([]);
        });

        it("When I add a song to the queue, it is appended to the end of the playing queue", function() {
            player.addSong(newSong);
            expect(player.queue).toEqual([firstSong, secondSong, thirdSong, newSong]);
        });

        it("When I remove the second song, the playing queue is now only the first and third song", function() {
            player.removeSong(secondSong);
            expect(player.queue).toEqual([firstSong, thirdSong]);
        });
    });

    describe("Given a song", function() {

        var song;
        beforeEach(function() {
            song = {
                id: 6726,
                name: 'Guarauno',
                artist: 'Carlyn Pollack',
                album: 'Arenig',
                playing: false
            };
        });

        xit("When I play it, the song is marked as playing", function() {
            player.play(song);

            expect(player.getPlayingSong()).toBe(song);
            expect(song.playing).toBeTruthy();
        });

        xit("When I restart playback, the song is still marked as playing", function() {
            song.playing = true;
            //player.getPlayingSong() = song;

            player.restart();

            expect(player.getPlayingSong()).toBe(song);
            expect(song.playing).toBeTruthy();
        });

        it("When the song was playing and I play it again, it restarts playback", function() {
            spyOn(player, "restart");

            player.play(song);
            player.play(song);

            expect(player.restart).toHaveBeenCalled();
        });

        it("When I restart playback, the flag for the directive is set", function() {
            player.restart();
            expect(player.restartSong).toBeTruthy();
        });

        it("When I load the song, the flag for the directive is set", function() {
            spyOn(player, "play");

            player.load(song);

            expect(player.loadSong).toBeTruthy();
            expect(player.play).toHaveBeenCalledWith(song);
        });
    });

    describe("Given that my playing queue is empty", function() {

        beforeEach(function() {
            player.queue = [];
            player.playingIndex = -1;
            spyOn(player, "play");
        });

        it("when I call nextTrack, it does nothing", function() {
            player.nextTrack();
            expect(player.play).not.toHaveBeenCalled();
            expect(player.playingIndex).toBe(-1);
        });

        it("when I call previousTrack, it does nothing", function() {
            player.previousTrack();
            expect(player.play).not.toHaveBeenCalled();
            expect(player.playingIndex).toBe(-1);
        });
    });
});

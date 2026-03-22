window.XiangyuCreateDeckActions = window.XiangyuCreateDeckActions || {};

(function bootstrapCreateDeckActions(namespace) {
    function normalizeDraftShape(draft) {
        return draft && typeof draft === 'object'
            ? draft
            : { timeline: {}, sceneVoiceover: [] };
    }

    function sortSceneEntries(entries) {
        return [...(Array.isArray(entries) ? entries : [])]
            .sort((left, right) => Number(left?.sceneIndex || 0) - Number(right?.sceneIndex || 0));
    }

    function updateTimelineSetting(draft, patch, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        return {
            draft: {
                ...safeDraft,
                timeline: normalizeTimeline({
                    ...timeline,
                    ...patch
                })
            }
        };
    }

    function appendMarker(draft, marker, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const markers = [...timeline.markers, marker];

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    markers
                }
            },
            selectedDeckMarkerIndex: markers.length - 1
        };
    }

    function replaceMarkerKinds(draft, kinds, markers, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const kindSet = new Set(Array.isArray(kinds) ? kinds : [kinds]);
        const preservedMarkers = timeline.markers.filter((marker) => !kindSet.has(marker?.kind));
        const nextMarkers = [...preservedMarkers, ...(Array.isArray(markers) ? markers : [])];

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    markers: nextMarkers
                }
            },
            selectedDeckMarkerIndex: (Array.isArray(markers) && markers.length > 0) ? preservedMarkers.length : null,
            preservedCount: preservedMarkers.length,
            generatedCount: Array.isArray(markers) ? markers.length : 0
        };
    }

    function clearGeneratedMarkers(draft, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const nextMarkers = timeline.markers.filter((marker) => marker?.generated !== true);

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    markers: nextMarkers
                }
            },
            selectedDeckMarkerIndex: null,
            clearedCount: timeline.markers.length - nextMarkers.length
        };
    }

    function upsertMarker(draft, marker, selectedDeckMarkerIndex, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const markers = [...timeline.markers];
        let nextSelectedIndex = selectedDeckMarkerIndex;

        if (!Number.isInteger(nextSelectedIndex) || nextSelectedIndex < 0 || nextSelectedIndex >= markers.length) {
            markers.push(marker);
            nextSelectedIndex = markers.length - 1;
        } else {
            markers[nextSelectedIndex] = marker;
        }

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    markers
                }
            },
            selectedDeckMarkerIndex: nextSelectedIndex
        };
    }

    function removeMarker(draft, selectedDeckMarkerIndex, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const markers = [...timeline.markers];
        markers.splice(selectedDeckMarkerIndex, 1);

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    markers
                }
            },
            selectedDeckMarkerIndex: markers.length > 0
                ? Math.min(selectedDeckMarkerIndex, markers.length - 1)
                : null
        };
    }

    function addAudioTrack(draft, track, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const audioTracks = [...timeline.audioTracks, track];

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    audioTracks
                }
            },
            selectedDeckAudioIndex: audioTracks.length - 1
        };
    }

    function upsertAudioTrack(draft, track, selectedDeckAudioIndex, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const audioTracks = [...timeline.audioTracks];
        let nextSelectedIndex = selectedDeckAudioIndex;

        if (!Number.isInteger(nextSelectedIndex) || nextSelectedIndex < 0 || nextSelectedIndex >= audioTracks.length) {
            audioTracks.push(track);
            nextSelectedIndex = audioTracks.length - 1;
        } else {
            audioTracks[nextSelectedIndex] = track;
        }

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    audioTracks
                }
            },
            selectedDeckAudioIndex: nextSelectedIndex
        };
    }

    function removeAudioTrack(draft, selectedDeckAudioIndex, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const audioTracks = [...timeline.audioTracks];
        audioTracks.splice(selectedDeckAudioIndex, 1);

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    audioTracks
                }
            },
            selectedDeckAudioIndex: audioTracks.length > 0
                ? Math.min(selectedDeckAudioIndex, audioTracks.length - 1)
                : null
        };
    }

    function duplicateAudioTrack(draft, selectedDeckAudioIndex, buildDuplicate, normalizeTimeline) {
        const safeDraft = normalizeDraftShape(draft);
        const timeline = normalizeTimeline(safeDraft.timeline);
        const audioTracks = [...timeline.audioTracks];
        const sourceTrack = audioTracks[selectedDeckAudioIndex];

        if (!sourceTrack) {
            return {
                draft: {
                    ...safeDraft,
                    timeline
                },
                selectedDeckAudioIndex: null
            };
        }

        const duplicatedTrack = typeof buildDuplicate === 'function'
            ? buildDuplicate(sourceTrack, selectedDeckAudioIndex, audioTracks)
            : { ...sourceTrack };

        if (!duplicatedTrack) {
            return {
                draft: {
                    ...safeDraft,
                    timeline
                },
                selectedDeckAudioIndex
            };
        }

        audioTracks.splice(selectedDeckAudioIndex + 1, 0, duplicatedTrack);

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    audioTracks
                }
            },
            selectedDeckAudioIndex: selectedDeckAudioIndex + 1
        };
    }

    function replaceVoiceoverEntries(draft, entries) {
        const safeDraft = normalizeDraftShape(draft);
        return {
            draft: {
                ...safeDraft,
                sceneVoiceover: sortSceneEntries(entries)
            }
        };
    }

    function clearGeneratedVoiceover(draft, normalizeSceneVoiceoverList) {
        const safeDraft = normalizeDraftShape(draft);
        const existingEntries = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const nextEntries = existingEntries.filter((entry) => entry?.generated !== true);

        return {
            draft: {
                ...safeDraft,
                sceneVoiceover: nextEntries
            },
            selectedDeckCueIndex: null,
            clearedCount: existingEntries.length - nextEntries.length
        };
    }

    function upsertVoiceoverScene(draft, sceneIndex, nextEntry, normalizeSceneVoiceoverList) {
        const safeDraft = normalizeDraftShape(draft);
        const existingEntries = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const nextEntries = existingEntries.filter((entry) => entry.sceneIndex !== sceneIndex);

        if (nextEntry) {
            nextEntries.push(nextEntry);
        }

        return {
            draft: {
                ...safeDraft,
                sceneVoiceover: sortSceneEntries(nextEntries)
            }
        };
    }

    function replaceSceneCues(draft, sceneIndex, cues, options = {}) {
        const safeDraft = normalizeDraftShape(draft);
        const normalizeSceneVoiceoverList = options.normalizeSceneVoiceoverList;
        const normalizeSceneVoiceover = options.normalizeSceneVoiceover;
        const getDefaultVoiceover = options.getDefaultVoiceover;
        const language = options.language;
        const text = options.text;
        const entries = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const existingEntry = entries.find((entry) => entry.sceneIndex === sceneIndex) || getDefaultVoiceover(sceneIndex);
        const nextEntry = normalizeSceneVoiceover({
            ...existingEntry,
            language: language || existingEntry.language,
            text: text || existingEntry.text,
            cues: Array.isArray(cues) ? cues : []
        }, sceneIndex) || getDefaultVoiceover(sceneIndex);
        const nextEntries = entries.filter((entry) => entry.sceneIndex !== sceneIndex);
        nextEntries.push(nextEntry);

        return {
            draft: {
                ...safeDraft,
                sceneVoiceover: sortSceneEntries(nextEntries)
            },
            selectedDeckCueIndex: Array.isArray(nextEntry?.cues) && nextEntry.cues.length > 0 ? 0 : null
        };
    }

    function upsertCue(draft, sceneIndex, cue, selectedDeckCueIndex, options = {}) {
        const safeDraft = normalizeDraftShape(draft);
        const normalizeSceneVoiceoverList = options.normalizeSceneVoiceoverList;
        const normalizeSceneVoiceover = options.normalizeSceneVoiceover;
        const getDefaultVoiceover = options.getDefaultVoiceover;
        const language = options.language;
        const text = options.text;
        const entries = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const existingEntry = entries.find((entry) => entry.sceneIndex === sceneIndex) || getDefaultVoiceover(sceneIndex);
        const cues = Array.isArray(existingEntry.cues) ? [...existingEntry.cues] : [];
        let nextSelectedCueIndex = selectedDeckCueIndex;

        if (!Number.isInteger(nextSelectedCueIndex) || nextSelectedCueIndex < 0 || nextSelectedCueIndex >= cues.length) {
            cues.push(cue);
            nextSelectedCueIndex = cues.length - 1;
        } else {
            cues[nextSelectedCueIndex] = cue;
        }

        const nextEntry = normalizeSceneVoiceover({
            ...existingEntry,
            language: language || existingEntry.language,
            text: text || existingEntry.text,
            cues
        }, sceneIndex) || getDefaultVoiceover(sceneIndex);
        const nextEntries = entries.filter((entry) => entry.sceneIndex !== sceneIndex);
        nextEntries.push(nextEntry);

        return {
            draft: {
                ...safeDraft,
                sceneVoiceover: sortSceneEntries(nextEntries)
            },
            selectedDeckCueIndex: nextSelectedCueIndex
        };
    }

    function removeCue(draft, sceneIndex, selectedDeckCueIndex, options = {}) {
        const safeDraft = normalizeDraftShape(draft);
        const normalizeSceneVoiceoverList = options.normalizeSceneVoiceoverList;
        const normalizeSceneVoiceover = options.normalizeSceneVoiceover;
        const language = options.language;
        const text = options.text;
        const entries = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const existingEntry = entries.find((entry) => entry.sceneIndex === sceneIndex) || null;

        if (!existingEntry) {
            return {
                draft: {
                    ...safeDraft,
                    sceneVoiceover: entries
                },
                selectedDeckCueIndex: null
            };
        }

        const cues = Array.isArray(existingEntry.cues) ? [...existingEntry.cues] : [];
        cues.splice(selectedDeckCueIndex, 1);
        const nextEntry = normalizeSceneVoiceover({
            ...existingEntry,
            language: language || existingEntry.language,
            text: text || existingEntry.text,
            cues
        }, sceneIndex);
        const nextEntries = entries.filter((entry) => entry.sceneIndex !== sceneIndex);
        if (nextEntry) {
            nextEntries.push(nextEntry);
        }

        return {
            draft: {
                ...safeDraft,
                sceneVoiceover: sortSceneEntries(nextEntries)
            },
            selectedDeckCueIndex: cues.length > 0
                ? Math.min(selectedDeckCueIndex, cues.length - 1)
                : null
        };
    }

    function applyTimelineStarter(draft, starter, options = {}) {
        const safeDraft = normalizeDraftShape(draft);
        const normalizeTimeline = options.normalizeTimeline;
        const normalizeSceneVoiceoverList = options.normalizeSceneVoiceoverList;
        const timeline = normalizeTimeline(safeDraft.timeline);
        const existingEntries = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const preservedMarkers = timeline.markers.filter((marker) => marker.generatedBy !== 'timeline-starter');
        const preservedEntries = existingEntries.filter((entry) => entry.generatedBy !== 'timeline-starter');
        const starterMarkers = Array.isArray(starter?.timeline?.markers) ? starter.timeline.markers : [];
        const starterVoiceover = Array.isArray(starter?.sceneVoiceover) ? starter.sceneVoiceover : [];
        const nextMarkers = [...preservedMarkers, ...starterMarkers];
        const nextVoiceover = normalizeSceneVoiceoverList([...preservedEntries, ...starterVoiceover]);

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    enabled: starter?.timeline?.enabled !== false,
                    autoplay: starter?.timeline?.autoplay === true,
                    subtitleMode: starter?.timeline?.subtitleMode || timeline.subtitleMode,
                    markers: nextMarkers
                },
                sceneVoiceover: nextVoiceover
            },
            selectedDeckMarkerIndex: starterMarkers.length > 0 ? preservedMarkers.length : null,
            selectedDeckVoiceoverSceneIndex: starterVoiceover.length > 0
                ? starterVoiceover[0].sceneIndex
                : options.selectedDeckVoiceoverSceneIndex,
            selectedDeckCueIndex: null
        };
    }

    function resetTimelineStarter(draft, options = {}) {
        const safeDraft = normalizeDraftShape(draft);
        const normalizeTimeline = options.normalizeTimeline;
        const normalizeSceneVoiceoverList = options.normalizeSceneVoiceoverList;
        const timeline = normalizeTimeline(safeDraft.timeline);
        const sceneVoiceover = normalizeSceneVoiceoverList(safeDraft.sceneVoiceover);
        const nextMarkers = timeline.markers.filter((marker) => marker.generatedBy !== 'timeline-starter');
        const nextVoiceover = sceneVoiceover.filter((entry) => entry.generatedBy !== 'timeline-starter');

        return {
            draft: {
                ...safeDraft,
                timeline: {
                    ...timeline,
                    markers: nextMarkers
                },
                sceneVoiceover: nextVoiceover
            },
            selectedDeckMarkerIndex: null,
            selectedDeckCueIndex: null
        };
    }

    namespace.updateTimelineSetting = updateTimelineSetting;
    namespace.appendMarker = appendMarker;
    namespace.replaceMarkerKinds = replaceMarkerKinds;
    namespace.clearGeneratedMarkers = clearGeneratedMarkers;
    namespace.upsertMarker = upsertMarker;
    namespace.removeMarker = removeMarker;
    namespace.addAudioTrack = addAudioTrack;
    namespace.upsertAudioTrack = upsertAudioTrack;
    namespace.removeAudioTrack = removeAudioTrack;
    namespace.duplicateAudioTrack = duplicateAudioTrack;
    namespace.replaceVoiceoverEntries = replaceVoiceoverEntries;
    namespace.clearGeneratedVoiceover = clearGeneratedVoiceover;
    namespace.upsertVoiceoverScene = upsertVoiceoverScene;
    namespace.replaceSceneCues = replaceSceneCues;
    namespace.upsertCue = upsertCue;
    namespace.removeCue = removeCue;
    namespace.applyTimelineStarter = applyTimelineStarter;
    namespace.resetTimelineStarter = resetTimelineStarter;
})(window.XiangyuCreateDeckActions);

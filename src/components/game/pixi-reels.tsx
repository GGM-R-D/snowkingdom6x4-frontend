'use client';

import * as PIXI from 'pixi.js';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { SymbolId } from '@/lib/slot-config';

type Reel = {
    container: PIXI.Container;
    symbols: PIXI.Sprite[];
    position: number;
    previousPosition: number;
    // blur intentionally disabled for crystal clear images
};

export type PixiReelsHandle = {
    spinTo: (targetGrid: SymbolId[][]) => Promise<void>;
};

type Props = {
    reelStrips: SymbolId[][];
    numRows: number;           // typically 4
    symbolSize?: number;       // default 144 to match md overlay
    reelWidth?: number;        // default symbolSize + 8 gap approx
    spinCycles?: number;       // base cycles before target stop
};

// Map SymbolId to image path in public
const symbolToPath: Record<SymbolId, string> = {
    WILD: '/images/symbols/Wild.png',
    SCATTER: '/images/symbols/Scatter.png',
    CROWN: '/images/symbols/Crown.png',
    DRAGON: '/images/symbols/Dragon.png',
    LEOPARD: '/images/symbols/Leopard.png',
    QUEEN: '/images/symbols/Queen.png',
    STONE: '/images/symbols/Stone.png',
    WOLF: '/images/symbols/Wolf.png',
    ACE: '/images/symbols/A.png',
    JACK: '/images/symbols/J.png',
    QUEEN_CARD: '/images/symbols/Q.png',
    KING: '/images/symbols/K.png',
    TEN: '/images/symbols/10.png',
};

export const PixiReels = forwardRef<PixiReelsHandle, Props>(function PixiReels(
    { reelStrips, numRows, symbolSize = 144, reelWidth, spinCycles = 12 },
    ref
) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    const reelsRef = useRef<Reel[]>([]);
    const texturesRef = useRef<Record<SymbolId, PIXI.Texture>>({} as any);
    const tweensRef = useRef<any[]>([]);

    const REELS = reelStrips.length; // 6
    const SYMBOL_SIZE = symbolSize;
    const GAP = 8; // must match overlay GAP
    const STEP_X = (reelWidth ?? (SYMBOL_SIZE + GAP)); // spacing between reels
    const STEP_Y = SYMBOL_SIZE + GAP;                  // spacing between rows
    const CONTENT_WIDTH = REELS * SYMBOL_SIZE + (REELS - 1) * GAP;
    const CONTENT_HEIGHT = numRows * SYMBOL_SIZE + (numRows - 1) * GAP;

    useEffect(() => {
        if (!mountRef.current) return;

        const app = new PIXI.Application();
        (async () => {
            const width = CONTENT_WIDTH;
            const height = CONTENT_HEIGHT;
            await app.init({
                backgroundAlpha: 0,
                width,
                height,
                antialias: true,
                resolution: Math.max(1, (globalThis as any).devicePixelRatio || 2),
            });
            appRef.current = app;
            if (mountRef.current) {
                const canvasEl = (app as any).canvas ?? (app as any).view;
                canvasEl.style.width = `${width}px`;
                canvasEl.style.height = `${height}px`;
                mountRef.current.appendChild(canvasEl);
            }
        })();

        const loadTextures = async () => {
            const entries = await Promise.all(
                (Object.keys(symbolToPath) as SymbolId[]).map(async (id) => {
                    const tex = await PIXI.Assets.load(symbolToPath[id]);
                    // Ensure maximum sharpness
                    try {
                        (tex as any).baseTexture && ((tex as any).baseTexture.mipmap = (PIXI as any).MIPMAP_MODES?.OFF ?? 0);
                        (tex as any).source && ((tex as any).source.mipmap = (PIXI as any).MIPMAP_MODES?.OFF ?? 0);
                        (tex as any).baseTexture && ((tex as any).baseTexture.anisotropicLevel = 0);
                    } catch {}
                    return [id, tex] as const;
                })
            );
            texturesRef.current = Object.fromEntries(entries) as Record<SymbolId, PIXI.Texture>;
        };

        const build = () => {
            const stage = app.stage;
            const reelContainer = new PIXI.Container();
            stage.addChild(reelContainer);

            const reels: Reel[] = [];
            for (let i = 0; i < REELS; i++) {
                const rc = new PIXI.Container();
                rc.x = i * STEP_X;
                reelContainer.addChild(rc);

                // no filters for sharp rendering
                rc.filters = [];

                const reel: Reel = { container: rc, symbols: [], position: 0, previousPosition: 0 } as Reel;
                for (let j = 0; j < numRows + 1; j++) {
                    const sid = reelStrips[i][Math.floor(Math.random() * reelStrips[i].length)];
                    const sp = new PIXI.Sprite(texturesRef.current[sid]);
                    sp.y = j * STEP_Y;
                    const scale = Math.min(SYMBOL_SIZE / sp.texture.width, SYMBOL_SIZE / sp.texture.height);
                    sp.scale.set(scale);
                    sp.x = Math.round((SYMBOL_SIZE - sp.width) / 2);
                    (sp as any).roundPixels = true;
                    reel.symbols.push(sp);
                    rc.addChild(sp);
                }
                reels.push(reel);
            }
            reelsRef.current = reels;

            // visible window mask
            const mask = new PIXI.Graphics();
            mask.beginFill(0xffffff, 1);
            mask.drawRect(0, 0, CONTENT_WIDTH, CONTENT_HEIGHT);
            mask.endFill();
            reelContainer.mask = mask;
            stage.addChild(mask);

            app.ticker.add(() => {
                for (const r of reelsRef.current) {
                    // track speed only for position bookkeeping
                    r.previousPosition = r.position;

                    for (let j = 0; j < r.symbols.length; j++) {
                        const s = r.symbols[j];
                        const prevy = s.y;
                        // Use virtual length = numRows + 1 because we render one extra symbol for smooth wrap
                        const virtual = numRows + 1;
                        s.y = ((r.position + j) % virtual) * STEP_Y - STEP_Y;
                        if (s.y < 0 && prevy > STEP_Y) {
                    const strip = reelStrips[reelsRef.current.indexOf(r)];
                    const nextId = strip[Math.floor(Math.random() * strip.length)];
                            s.texture = texturesRef.current[nextId];
                            const scale = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                            s.scale.set(scale);
                            s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                        }
                    }
                }

                const now = Date.now();
                const remove: any[] = [];
                for (const t of tweensRef.current) {
                    const phase = Math.min(1, (now - t.start) / t.time);
                    t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
                    if (t.change) t.change(t);
                    if (phase === 1) {
                        t.object[t.property] = t.target;
                        if (t.complete) t.complete(t);
                        remove.push(t);
                    }
                }
                for (const r of remove) {
                    const idx = tweensRef.current.indexOf(r);
                    if (idx >= 0) tweensRef.current.splice(idx, 1);
                }
            });
        };

        (async () => {
            await loadTextures();
            build();
        })();

        return () => {
            try { app.destroy(); } catch {}
            appRef.current = null;
            reelsRef.current = [];
            tweensRef.current = [];
        };
    }, [REELS, STEP_X, STEP_Y, CONTENT_WIDTH, CONTENT_HEIGHT, SYMBOL_SIZE, numRows, reelStrips]);

    useImperativeHandle(ref, () => ({
        spinTo: (targetGrid: SymbolId[][]) => spinTo(targetGrid),
    }));

    function lerp(a1: number, a2: number, t: number) {
        return a1 * (1 - t) + a2 * t;
    }
    function backout(amount: number) {
        return (t: number) => {
            t -= 1;
            return t * t * ((amount + 1) * t + amount) + 1;
        };
    }
    function tweenTo(object: any, property: string, target: number, time: number, easing: (t:number)=>number, onchange?: any, oncomplete?: any) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };
        tweensRef.current.push(tween);
        return tween;
    }

    function findStopIndexForReel(reelIndex: number, wantedColumn: SymbolId[]): number {
        // The top visible row is index 0. We render sprites at y = (-1, 0, 1, 2)*STEP_Y during spin window.
        // Our position increases downward; at stop, we want symbols at rows 0..numRows-1 to equal wantedColumn[0..numRows-1].
        const strip = reelStrips[reelIndex];
        const n = strip.length;
        for (let i = 0; i < n; i++) {
            let matches = true;
            for (let r = 0; r < numRows; r++) {
                const stripIndex = (i + r) % n;
                if (strip[stripIndex] !== wantedColumn[r]) { matches = false; break; }
            }
            if (matches) return i;
        }
        return 0;
    }

    function spinTo(targetGrid: SymbolId[][]): Promise<void> {
        return new Promise<void>((resolve) => {
            const reels = reelsRef.current;
            let completed = 0;
            for (let i = 0; i < reels.length; i++) {
                const r = reels[i];
                const wantedColumn = targetGrid[i];
                const stopIndex = findStopIndexForReel(i, wantedColumn);
                const cycles = spinCycles + i * 2 + Math.floor(Math.random() * 2);
                const target = r.position + cycles + stopIndex;
                const time = 1600 + i * 220;
                tweenTo(r, 'position', target, time, backout(0.55), null, () => {
                    // Snap position to integer step
                    const virtual = numRows + 1;
                    r.position = Math.round(r.position);
                    r.previousPosition = r.position;

                    // Map visible rows to actual sprite indices based on final position
                    const P = ((r.position % virtual) + virtual) % virtual; // 0..virtual-1
                    for (let row = 0; row < numRows; row++) {
                        // y=0 corresponds to ((P + j) % virtual) == 1 → jVis = (1 - P) mod virtual
                        const jVis = (row + 1 - P + virtual) % virtual;
                        const sp = r.symbols[jVis];
                        const id = wantedColumn[row];
                        const tex = texturesRef.current[id];
                        if (sp.texture !== tex) sp.texture = tex;
                        const scale = Math.min(SYMBOL_SIZE / sp.texture.width, SYMBOL_SIZE / sp.texture.height);
                        sp.scale.set(scale);
                        sp.x = Math.round((SYMBOL_SIZE - sp.width) / 2);
                        sp.y = row * STEP_Y;
                    }
                    // Position the extra sprite just below the visible window
                    const extraIndex = (numRows + 1 - P + virtual) % virtual;
                    const extra = r.symbols[extraIndex];
                    extra.y = numRows * STEP_Y;
                    // Keep extra texture consistent with the strip flow (choose the next symbol in strip)
                    const strip = reelStrips[i];
                    const afterLastId = strip[(stopIndex + numRows) % strip.length];
                    extra.texture = texturesRef.current[afterLastId];
                    const exScale = Math.min(SYMBOL_SIZE / extra.texture.width, SYMBOL_SIZE / extra.texture.height);
                    extra.scale.set(exScale);
                    extra.x = Math.round((SYMBOL_SIZE - extra.width) / 2);

                    completed++;
                    if (completed === reels.length) resolve();
                });
            }
        });
    }

    return (
        <div ref={mountRef} style={{ width: CONTENT_WIDTH, height: CONTENT_HEIGHT }} />
    );
});



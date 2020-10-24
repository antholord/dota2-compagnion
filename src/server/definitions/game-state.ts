/* eslint-disable camelcase */

export interface Provider {
        name: string;
        appid: number;
        version: number;
        timestamp: number;
    }

export interface Map {
        name: string;
        matchid: string;
        game_time: number;
        clock_time: number;
        daytime: boolean;
        nightstalker_night: boolean;
        game_state: string;
        paused: boolean;
        win_team: string;
        customgamename: string;
        ward_purchase_cooldown: number;
    }

export interface KillList {
    }

export interface Player {
        steamid: string;
        name: string;
        activity: string;
        kills: number;
        deaths: number;
        assists: number;
        last_hits: number;
        denies: number;
        kill_streak: number;
        commands_issued: number;
        kill_list: KillList;
        team_name: string;
        gold: number;
        gold_reliable: number;
        gold_unreliable: number;
        gold_from_hero_kills: number;
        gold_from_creep_kills: number;
        gold_from_income: number;
        gold_from_shared: number;
        gpm: number;
        xpm: number;
    }

export interface Hero {
        xpos: number;
        ypos: number;
        id: number;
        name: string;
        level: number;
        alive: boolean;
        respawn_seconds: number;
        buyback_cost: number;
        buyback_cooldown: number;
        health: number;
        max_health: number;
        health_percent: number;
        mana: number;
        max_mana: number;
        mana_percent: number;
        silenced: boolean;
        stunned: boolean;
        disarmed: boolean;
        magicimmune: boolean;
        hexed: boolean;
        muted: boolean;
        break: boolean;
        smoked: boolean;
        has_debuff: boolean;
        talent_1: boolean;
        talent_2: boolean;
        talent_3: boolean;
        talent_4: boolean;
        talent_5: boolean;
        talent_6: boolean;
        talent_7: boolean;
        talent_8: boolean;
    }

export interface GameState {
        provider: Provider;
        map: Map;
        player: Player;
        hero: Hero;
    }

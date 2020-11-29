declare module 'pixel-pizza' {
    import {Client, ClientOptions, Collection, ColorResolvable, Guild, GuildMember, Message, MessageEmbed, MessageReaction, MessageResolvable, RoleResolvable, Snowflake, TextChannel, User} from "discord.js";
    import {Canvas} from "canvas";

    type ColorData = {
        hex: string,
        rgb: [number, number, number],
        hsl: [number, number, number],
        cmyk: [number, number, number, number]
    }

    type WebhookData = {
        id: Snowflake,
        token: string
    }

    type ApplicationType = {
        name: string,
        aliases: string[],
        questions: string[]
    }

    type EmbedOptions = {
        color?: ColorResolvable,
        title?: string,
        url?: string,
        author?: {
            name: string,
            icon?: string,
            url?: string
        },
        description?: string,
        thumbnail?: string,
        fields?: {
            name: string,
            value: string,
            inline?: boolean
        }[],
        image?: string,
        timestamp?: boolean,
        footer?: {
            text: string,
            icon?: string
        }
    }

    type ConsoleFunction = (text: string, title?: string) => void

    export const colors: {
        black: ColorData,
        white: ColorData,
        red: ColorData,
        green: ColorData,
        blue: ColorData,
        yellow: ColorData,
        lightblue: ColorData,
        purple: ColorData,
        orange: ColorData,
        silver: ColorData,
        darkgray: ColorData,
        darkgrey: ColorData,
        gray: ColorData,
        grey: ColorData,
        lightgray: ColorData,
        lightgrey: ColorData,
        noiceboard: ColorData,
        levels: {
            front: ColorData,
            back: ColorData,
            expfront: ColorData,
            expback: ColorData
        }
    }

    export const channels: {
        voice: {
            allMembers: Snowflake,
            members: Snowflake,
            bots: Snowflake
        },
        text: {
            logs: Snowflake,
            noiceboard: Snowflake,
            updates: Snowflake,
            kitchen: Snowflake,
            images: Snowflake,
            delivery: Snowflake,
            restaurant: Snowflake,
            applications: Snowflake,
            suggestions: Snowflake,
            complaints: Snowflake
        }
    }

    export const webhooks: {
        log: WebhookData
    }

    export const emojis: {
        noice: Snowflake,
        noice2: Snowflake
    }

    export const ingredients: string[];

    export const level: {
        baseexp: number,
        addexp: number
    }

    export const questions: {
        worker: ApplicationType,
        teacher: ApplicationType,
        developer: ApplicationType,
        staff: ApplicationType
    }

    export const roles: {
        developer: Snowflake,
        cook: Snowflake,
        deliverer: Snowflake,
        proCook: Snowflake,
        proDeliverer: Snowflake,
        work: Snowflake,
        ceo: Snowflake,
        verified: Snowflake,
        worker: Snowflake[],
        teacher: Snowflake[],
        staff: Snowflake[],
        director: Snowflake[],
        levelRoles: {
            five: Snowflake,
            ten: Snowflake,
            twentyfive: Snowflake,
            fifty: Snowflake,
            hundered: Snowflake
        },
        pings: {
            cook: Snowflake,
            deliver: Snowflake
        }
    }

    export const rules: {
        rules: string[],
        anarchyRules: string[]
    };

    export const config: {
        prefix: string,
        currency: string,
        verification: Snowflake,
        workerRoles: Snowflake,
        botGuild: Snowflake,
        noiceboardMinValue: number,
        maxPizzas: number,
        proAmount: number,
        idLength: number,
        orderCooldown: number,
        minPrice: number,
        maxPrice: number,
        minWorkEarning: number,
        maxWorkEarning: number,
        statuses: {
            orders: string[],
            applications: string[]
        },
        restrictedDomains: string[],
        pponlyexceptions: Snowflake[],
        invite: string,
        creators: Snowflake[]
    }
    
    export class PPClient extends Client {
        constructor(options: ClientOptions);
        public commands: Collection<string, any>;
        public cooldowns: Collection<string, Collection<string, number>>;
        public guildMembers: Collection<string, GuildMember>;
        public toggles: {
            cooldowns: boolean,
            addExp: boolean,
            pponlyChecks: boolean,
            workerApplications: boolean,
            teacherApplications: boolean,
            developerApplications: boolean,
            staffApplications: boolean,
            cookOwnOrder: boolean,
            deliverOwnOrder: boolean
        };
        public canSendEmbeds: boolean;
    }

    export const addRole: (member: GuildMember, role: RoleResolvable) => Promise<GuildMember>

    export const capitalize: (string: string) => string

    export const checkNoiceBoard: (messageReaction: MessageReaction) => any

    export const createEmbed: (options: EmbedOptions) => MessageEmbed

    export const editEmbed: (embedMsg: MessageEmbed, options: EmbedOptions) => MessageEmbed

    export const getGuild: (args: string[], client: PPClient) => Guild

    export const getUser: (message: Message, args: string[], client: PPClient) => User

    export const hasRole: (member: GuildMember, role: RoleResolvable) => boolean

    export const inBotGuild: (client: PPClient, userId: Snowflake) => boolean

    export const isImage: (url: string) => boolean

    export const isVip: (member: GuildMember) => boolean

    export const randomInt: (min: number, max: number) => number

    export const removeRole: (member: GuildMember, role: RoleResolvable) => Promise<GuildMember>

    export const request: (url: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") => Promise<any>

    export const sendEmbed: (embed: MessageEmbed, message: Message) => Promise<Message>

    export const sendEmbedWithChannel: (embed: MessageEmbed, client: PPClient, channel: TextChannel) => Promise<Message>

    export const sendGuildLog: (name: string, avatar: string, message: MessageResolvable | MessageEmbed) => Promise<void>

    export const setCooldown: (client: PPClient, commandName: string, userId: Snowflake, seconds: number) => void

    export const updateGuildAmount: (client: PPClient) => void

    export const updateMemberSize: (client: PPClient) => void

    export const wait: (ms: number) => Promise<any>

    export const makeRankImg: (user: User, level: number, exp: number, rank: number, style: {
        back: string,
        front: string,
        expBack: string,
        expFront: string
    }) => Promise<Canvas>

    export function clear(): void

    export function count(label: string): void

    export const error: ConsoleFunction

    export const fatal: ConsoleFunction

    export const info: ConsoleFunction

    export const log: ConsoleFunction

    export const notice: ConsoleFunction

    export const resetCount: (label: string) => void 

    export const sendServerLog: (text: string, title?: string) => Promise<void>

    export const success: ConsoleFunction

    export const warn: ConsoleFunction
}
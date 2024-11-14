export interface Team {
	id: string;
	name: string;
	displayName: string;
	isPro: boolean;
	personal: boolean;
	expiredAt: string;
	usage: {
		keyTotal: number;
		projectTotal: number;
		translationTotal: number;
	};
	inviteLink: string;
	role: "owner" | "member" | "viewer" | string;
}

export interface TeamMember {
	id: number;
	displayName: string;
	photo: string;
	role: string;
}

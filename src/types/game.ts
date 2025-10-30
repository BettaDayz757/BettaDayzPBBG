/**
 * BettaDayz PBBG - Game Type Definitions
 * Generated from GAME-FEATURES.md specification
 */

// ==================== Character & Player Types ====================

export type SkinTone = 'light' | 'light-medium' | 'medium' | 'medium-deep' | 'deep' | 'very-deep';

export type Hairstyle = 
  | 'afro' 
  | 'locs' 
  | 'braids' 
  | 'waves' 
  | 'fade' 
  | 'twists' 
  | 'natural' 
  | 'buzz' 
  | 'cornrows';

export type FacialHair = 'clean' | 'goatee' | 'beard' | 'mustache' | 'full-beard';

export type Style = 
  | 'streetwear' 
  | 'business' 
  | 'casual' 
  | 'athletic' 
  | 'cultural' 
  | 'formal';

export type Accessory = 
  | 'chains' 
  | 'watches' 
  | 'glasses' 
  | 'hats' 
  | 'headwraps' 
  | 'earrings';

export interface CharacterCustomization {
  skinTone: SkinTone;
  hairstyle: Hairstyle;
  facialHair: FacialHair;
  style: Style;
  accessories: Accessory[];
}

// ==================== Life Simulation Types ====================

export type EducationLevel = 
  | 'high-school' 
  | 'community-college' 
  | 'hbcu' 
  | 'trade-school' 
  | 'masters' 
  | 'phd';

export type RelationshipStatus = 
  | 'single' 
  | 'dating' 
  | 'engaged' 
  | 'married' 
  | 'divorced';

export type LifeChallenge = 
  | 'health-issues' 
  | 'legal-troubles' 
  | 'financial-crisis' 
  | 'family-emergencies';

export interface LifeEvent {
  id: string;
  name: string;
  description: string;
  ageTriggered: number;
  effects: {
    money?: number;
    reputation?: number;
    skills?: Partial<SkillSet>;
  };
}

// ==================== Location Types ====================

export type TrafficLevel = 'low' | 'medium' | 'growing' | 'high';

export interface LocationDemographics {
  africanAmericanPercentage: number;
  primaryDemographic: string;
}

export interface Location {
  id: string;
  name: string;
  cost: number;
  traffic: TrafficLevel;
  demographics: LocationDemographics;
  significance: string;
  unlockLevel?: number;
}

// ==================== Business Types ====================

export type BusinessCategory = 
  | 'technology' 
  | 'retail' 
  | 'restaurant' 
  | 'real-estate' 
  | 'entertainment' 
  | 'service' 
  | 'manufacturing';

export type CulturalBusinessType = 
  | 'barbershop-salon' 
  | 'soul-food' 
  | 'music-studio' 
  | 'fashion-streetwear' 
  | 'community-center' 
  | 'cultural-arts' 
  | 'business-consulting';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory | CulturalBusinessType;
  description: string;
  startupCost: number;
  monthlyRevenue: number;
  requiredLevel: number;
  requiredReputation: number;
  location?: string;
}

// ==================== HBCU Types ====================

export type HBCUName = 
  | 'norfolk-state' 
  | 'hampton-university' 
  | 'virginia-state';

export interface HBCU {
  id: string;
  name: HBCUName;
  displayName: string;
  partnerships: string[];
  benefits: string[];
  programs: string[];
}

// ==================== Organization Types ====================

export interface OrganizationBenefits {
  networking?: number;
  reputation?: number;
  minorityContracts?: number;
  talentRecruitment?: number;
  mentorship?: number;
  innovation?: number;
  technology?: number;
  studentTalent?: number;
  communityImpact?: number;
  workforceDevelopment?: number;
  youthDevelopment?: number;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  benefits: OrganizationBenefits;
  monthlyCost: number;
  requirements: {
    reputation?: number;
    level?: number;
    education?: EducationLevel;
    location?: string;
  };
}

// ==================== Crew & Territory Types ====================

export type CrewRole = 'leader' | 'underboss' | 'enforcer' | 'member';

export interface CrewRoleRequirements {
  role: CrewRole;
  bonus: number;
  requiredLevel: number;
  requiredReputation: number;
}

export interface Territory {
  id: string;
  name: string;
  bonus: string;
  bonusPercentage: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type StreetActivityRisk = 'low' | 'medium' | 'medium-high' | 'high';

export interface StreetActivity {
  id: string;
  name: string;
  risk: StreetActivityRisk;
  riskPercentage: number;
  reward: number;
  durationMinutes: number;
}

// ==================== Event Types ====================

export type EventCategory = 'community' | 'business' | 'seasonal' | 'challenge';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface GameEvent {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  season?: Season;
  rewards?: {
    money?: number;
    reputation?: number;
    skills?: Partial<SkillSet>;
  };
  requirements?: {
    level?: number;
    reputation?: number;
    location?: string;
  };
}

// ==================== Historical Landmark Types ====================

export interface HistoricalLandmark {
  id: string;
  name: string;
  description: string;
  historicalSignificance: string;
  founded?: number;
  location: string;
  unlockLevel: number;
}

// ==================== Cultural Icon Types ====================

export interface CulturalIcon {
  id: string;
  name: string;
  influence: string[];
  connection: string;
  inspiration: string;
}

// ==================== Skill System Types ====================

export type SkillName = 
  | 'leadership' 
  | 'marketing' 
  | 'finance' 
  | 'networking' 
  | 'innovation' 
  | 'management' 
  | 'community' 
  | 'business';

export interface SkillSet {
  leadership: number;
  marketing: number;
  finance: number;
  networking: number;
  innovation: number;
  management: number;
  community: number;
  business: number;
}

export interface Skill {
  name: SkillName;
  level: number;
  experience: number;
  description: string;
}

// ==================== Social Interaction Types ====================

export type SocialInteractionType = 
  | 'network-events' 
  | 'mentor-entrepreneurs' 
  | 'business-collaboration' 
  | 'community-service' 
  | 'hbcu-campus-visits';

export interface SocialInteraction {
  id: string;
  type: SocialInteractionType;
  name: string;
  description: string;
  cooldownSeconds: number;
  effects: {
    money?: number;
    reputation?: number;
    skills?: Partial<SkillSet>;
    connections?: number;
  };
}

// ==================== Player & Game State Types ====================

export interface PlayerStats {
  money: number;
  age: number;
  level: number;
  reputation: number;
  netWorth: number;
  friends: number;
  crewSize: number;
}

export interface PlayerState {
  id: string;
  userId: string;
  stats: PlayerStats;
  customization: CharacterCustomization;
  education: EducationLevel;
  relationshipStatus: RelationshipStatus;
  skills: SkillSet;
  businesses: string[]; // Business IDs
  territories: string[]; // Territory IDs
  crewRole?: CrewRole;
  organizations: string[]; // Organization IDs
  unlockedLandmarks: string[]; // Landmark IDs
  completedEvents: string[]; // Event IDs
  lastSocialInteraction?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Seasonal Modifier Types ====================

export interface SeasonalModifier {
  season: Season;
  modifiers: {
    tourism: number;
    retail: number;
    food: number;
    service: number;
  };
}

// ==================== Game Progression Types ====================

export interface ProgressionMilestone {
  level: number;
  unlocks: string[];
  description: string;
}

export interface StartingResources {
  money: number;
  age: number;
  level: number;
  reputation: number;
}

// ==================== Constants ====================

export const GAME_CONSTANTS = {
  STARTING_AGE: 18,
  MAX_AGE: 85,
  YEARS_PER_LEVEL: 2,
  MAX_FRIENDS: 100,
  MAX_CREW_SIZE: 20,
  SOCIAL_COOLDOWN_MINUTES: 5,
  STARTING_MONEY: 10000,
  STARTING_LEVEL: 1,
  STARTING_REPUTATION: 0,
  MAX_REPUTATION: 100,
} as const;

// ==================== Validation Types ====================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export type ValidatorFunction<T> = (data: T) => ValidationResult;

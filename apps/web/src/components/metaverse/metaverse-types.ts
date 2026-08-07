export type CityBuildingType =
  | 'microservice_building'
  | 'database_datacenter'
  | 'gateway_tower'
  | 'cache_vault'
  | 'kafka_highway'
  | 'cloud_cluster';

export interface CityBuilding {
  id: string;
  name: string;
  buildingType: CityBuildingType;
  heightLevel: number;
  status: 'vibrant_healthy' | 'degraded_warning' | 'critical_hotspot';
  qps: number;
  p95LatencyMs: number;
  techDebtHours: number;
  ownerTeam: string;
  buildingDescription: string;
  x: number;
  y: number;
}

export interface CityTrafficHighway {
  id: string;
  sourceBuildingId: string;
  targetBuildingId: string;
  protocol: 'gRPC' | 'HTTP/2' | 'Kafka Stream' | 'SQL';
  throughputQps: number;
  health: 'healthy' | 'congested';
}

export interface StoryModeTourStep {
  stepIndex: number;
  title: string;
  narrationText: string;
  focusBuildingId: string;
  actionText: string;
  subsystemLink: string;
}

export interface MultiplayerCollaborator {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  currentFocusBuilding: string;
  isVoiceConnected: boolean;
}

export interface SubsystemPortal {
  id: string;
  name: string;
  route: string;
  description: string;
  iconName: string;
}

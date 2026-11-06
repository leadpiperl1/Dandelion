export type Trit = -1 | 0 | 1;

export interface ClusterNodeTelemetry {
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  dmabuf_ring_bytes: number;
  dmabuf_crc32c: string;
  iouring_throughput_gbps?: number;
  heterodyne_clock_mhz?: number;
  sband_spi_mux?: string;
  mtp_p99_9_us?: number;
  tensegrity_unloaded_n?: number;
  euler_buckling_sf?: number;
  junction_temp_c: number;
  power_draw_w: number;
  entropy_ds: number;
}

export interface MorningTelemetry {
  schema_version: string;
  timestamp_utc: string;
  operator: string;
  orcid: string;
  zenodo_doi: string;
  concept_doi: string;
  cluster_nodes: Record<string, ClusterNodeTelemetry>;
  invariants: {
    landauer_bound_satisfied: boolean;
    tetrahedral_cosine: number;
    manifold_tension_deg: number;
    ternary_raft_quorum: string;
  };
}

export interface FowlerPackResult {
  trits: Trit[];
  packedBytes: number[];
  trapCode: number;
  isValid: boolean;
}

export interface HaarDwtResult {
  lowPassIntent: number[];
  highPassTremor: number[];
  barkerScore: number;
  isBarkerLocked: boolean;
  mtpLatencyUs: number;
  sparsityPermille: number;
}

export interface TensegrityCalculation {
  torsoWeightN: number;
  slingUnloadedN: number;
  discResidualN: number;
  percentRelief: number;
  tendonTensionN: number;
  strutCompressionN: number;
  criticalEulerBucklingN: number;
  eulerSafetyFactor: number;
  governorTorqueRawUnm: number;
  governorTorqueNetUnm: number;
  isKintsugiClamped: boolean;
  boundaryCode: number;
}

export interface RaftNodeState {
  id: string;
  role: 'Leader' | 'Follower' | 'Candidate';
  currentTerm: number;
  voteState: Trit;
  dmaBufSize: number;
  crc32c: string;
  powerWatts: number;
  temperatureC: number;
}

export interface VerificationAuditResult {
  id: string;
  name: string;
  status: 'PASS' | 'RUNNING' | 'PENDING' | 'FAIL';
  details: string;
  metrics: Record<string, string | number | boolean>;
  timestamp: string;
}

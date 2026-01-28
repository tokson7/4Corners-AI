/**
 * Design System Versioning
 * Tracks versions of generated design systems
 */

import type { DesignSystem } from "@/lib/types/designSystem";

export interface DesignSystemVersion {
  version: number;
  id: string;
  designSystem: DesignSystem;
  timestamp: string;
  generationIntent: string;
  changes: VersionChange[];
  parentVersionId?: string; // ID of parent version (for refinement chains)
}

export interface VersionChange {
  type: "color" | "typography" | "component" | "spacing" | "other";
  description: string;
  severity: "low" | "medium" | "high";
}

// In-memory version store (TODO: Replace with database)
const versionStore: Map<string, DesignSystemVersion[]> = new Map(); // userId -> versions[]

/**
 * Create a new version of a design system
 */
export function createVersion(
  userId: string,
  designSystem: DesignSystem,
  generationIntent: string,
  parentVersionId?: string
): DesignSystemVersion {
  const userVersions = versionStore.get(userId) || [];
  const nextVersion = userVersions.length > 0 
    ? Math.max(...userVersions.map(v => v.version)) + 1 
    : 1;

  const versionId = `v${nextVersion}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Compare with previous version to determine changes
  const previousVersion = parentVersionId
    ? userVersions.find(v => v.id === parentVersionId)
    : userVersions[userVersions.length - 1];

  const changes = previousVersion
    ? compareVersions(previousVersion.designSystem, designSystem)
    : [{
        type: "other" as const,
        description: "Initial generation",
        severity: "low" as const,
      }];

  const version: DesignSystemVersion = {
    version: nextVersion,
    id: versionId,
    designSystem,
    timestamp: new Date().toISOString(),
    generationIntent,
    changes,
    parentVersionId: previousVersion?.id,
  };

  userVersions.push(version);
  versionStore.set(userId, userVersions);

  return version;
}

/**
 * Get all versions for a user
 */
export function getVersions(userId: string): DesignSystemVersion[] {
  return versionStore.get(userId) || [];
}

/**
 * Get a specific version by ID
 */
export function getVersion(userId: string, versionId: string): DesignSystemVersion | null {
  const versions = versionStore.get(userId) || [];
  return versions.find(v => v.id === versionId) || null;
}

/**
 * Get the latest version for a user
 */
export function getLatestVersion(userId: string): DesignSystemVersion | null {
  const versions = versionStore.get(userId) || [];
  if (versions.length === 0) return null;
  return versions.sort((a, b) => b.version - a.version)[0];
}

/**
 * Compare two design system versions to determine changes
 */
function compareVersions(
  previous: DesignSystem,
  current: DesignSystem
): VersionChange[] {
  const changes: VersionChange[] = [];

  // Compare colors
  if (previous.colors?.primary?.main !== current.colors?.primary?.main) {
    changes.push({
      type: "color",
      description: "Primary color changed",
      severity: "high",
    });
  }

  if (previous.colors?.secondary?.main !== current.colors?.secondary?.main) {
    changes.push({
      type: "color",
      description: "Secondary color changed",
      severity: "medium",
    });
  }

  // Compare typography
  if (previous.typography?.heading?.font !== current.typography?.heading?.font) {
    changes.push({
      type: "typography",
      description: "Heading font changed",
      severity: "high",
    });
  }

  if (previous.typography?.body?.font !== current.typography?.body?.font) {
    changes.push({
      type: "typography",
      description: "Body font changed",
      severity: "medium",
    });
  }

  // Compare components
  const previousComponents = previous.components?.map(c => c.name) || [];
  const currentComponents = current.components?.map(c => c.name) || [];
  const addedComponents = currentComponents.filter(c => !previousComponents.includes(c));
  const removedComponents = previousComponents.filter(c => !currentComponents.includes(c));

  if (addedComponents.length > 0) {
    changes.push({
      type: "component",
      description: `Added components: ${addedComponents.join(", ")}`,
      severity: "medium",
    });
  }

  if (removedComponents.length > 0) {
    changes.push({
      type: "component",
      description: `Removed components: ${removedComponents.join(", ")}`,
      severity: "medium",
    });
  }

  if (changes.length === 0) {
    changes.push({
      type: "other",
      description: "No significant changes detected",
      severity: "low",
    });
  }

  return changes;
}

/**
 * Get version history chain (all versions leading to a specific version)
 */
export function getVersionChain(userId: string, versionId: string): DesignSystemVersion[] {
  const versions = versionStore.get(userId) || [];
  const targetVersion = versions.find(v => v.id === versionId);
  if (!targetVersion) return [];

  const chain: DesignSystemVersion[] = [targetVersion];
  let current = targetVersion;

  while (current.parentVersionId) {
    const parent = versions.find(v => v.id === current.parentVersionId);
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }

  return chain;
}


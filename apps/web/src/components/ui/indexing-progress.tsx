'use client';

import React from 'react';
import { RepositoryAnalysisExperience } from './repository-analysis-experience';

interface IndexingProgressProps {
	onComplete?: () => void;
	repoName?: string;
}

export function IndexingProgress({ onComplete, repoName = 'CodeAtlas-Core' }: IndexingProgressProps) {
	return (
		<RepositoryAnalysisExperience
			onClose={onComplete}
			onComplete={onComplete}
			initialRepoName={repoName}
		/>
	);
}


import {
    ArrowUpRight,
    Box,
    Check,
    Lightbulb,
    Sparkles,
    Zap
} from 'lucide-react';

function formatRoundDate(value, locale) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return locale === 'zh-CN'
        ? new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).format(date)
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
}

function shouldRenderLogEntry(entry) {
    if (!entry) {
        return false;
    }

    if (entry.eventType === 'run_started' || entry.eventType === 'planning_started') {
        return false;
    }

    return true;
}

function ArtifactCard({ entry, locale, buildArtifactTags, buildLocalePath, previewLabel, openLabel }) {
    const artifact = entry.artifact;
    if (!artifact) {
        return null;
    }

    const hiddenArtifactTypes = new Set(['brief', 'presentation', 'spec', 'html', 'pptx']);
    if (hiddenArtifactTypes.has(String(artifact.type || '').trim())) {
        return null;
    }

    const tags = buildArtifactTags(artifact, locale);
    const hasPreviewRoute = Boolean(artifact.presentationId);
    const actionHref = hasPreviewRoute
        ? buildLocalePath(`/presentations/${artifact.presentationId}`, locale)
        : artifact.url || '';
    const routeLabel = hasPreviewRoute
        ? actionHref
        : artifact.url || artifact.presentationId || '';

    return (
        <div className="rail-artifact-card">
            <div className="rail-artifact-head">
                <div className="rail-artifact-copy">
                    <strong>{artifact.label || artifact.type || 'artifact'}</strong>
                    {routeLabel ? <span>{routeLabel}</span> : null}
                </div>
                {artifact.status ? (
                    <span className={`rail-artifact-status is-${String(artifact.status).toLowerCase()}`}>
                        {artifact.status}
                    </span>
                ) : null}
            </div>
            {tags.length ? (
                <div className="rail-tag-row rail-tag-row-artifact">
                    {tags.map((tag) => (
                        <span className="rail-tag" key={`${entry.id}_${tag}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}
            {actionHref ? (
                <div className="rail-artifact-actions">
                    <a className="rail-inline-action" href={actionHref}>
                        <span>{hasPreviewRoute ? previewLabel : openLabel}</span>
                        <ArrowUpRight size={13} />
                    </a>
                </div>
            ) : null}
        </div>
    );
}

function UserBubble({ entry, locale, roleLabel }) {
    return (
        <article className="rail-message rail-message-user" key={entry.id}>
            <div className="rail-bubble-meta rail-bubble-meta-user">
                <span>{roleLabel}</span>
            </div>
            <div className="rail-bubble rail-bubble-user">
                <p>{entry.content}</p>
            </div>
        </article>
    );
}

function AssistantBubble({ entry, locale, roleLabel }) {
    return (
        <article className="rail-message rail-message-assistant" key={entry.id}>
            <div className="rail-assistant-head">
                <span className="rail-assistant-badge">
                    <Sparkles size={13} />
                    {roleLabel}
                </span>
            </div>
            <div className="rail-bubble rail-bubble-assistant rail-bubble-assistant-plain">
                <p>{entry.content}</p>
            </div>
        </article>
    );
}

function StepEntry({
    entry,
    locale,
    kind,
    isLastStep,
    buildArtifactTags,
    buildLocalePath,
    previewLabel,
    openLabel
}) {
    const Icon = kind === 'thinking'
        ? Lightbulb
        : kind === 'result'
            ? Check
            : kind === 'tool'
                ? Box
                : Zap;

    const cardKind = kind === 'error' ? 'error' : kind;

    return (
        <article className={`rail-message rail-step-block rail-step-block-${cardKind} ${isLastStep ? 'is-last-step' : ''}`}>
            <div className="rail-step-head">
                <div className="rail-step-title-wrap">
                    <span className={`rail-step-node rail-step-node-${cardKind}`}>
                        <Icon size={12} />
                    </span>
                    <strong>{entry.stepLabel || (locale === 'zh-CN' ? '执行步骤' : 'Step')}</strong>
                    {entry.stepStatus ? (
                        <span className={`rail-status-pill is-${entry.stepStatus}`}>
                            {entry.stepStatus}
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="rail-step-body">
                <p>{entry.content}</p>
            </div>
            {entry.artifact ? (
                <ArtifactCard
                    entry={entry}
                    locale={locale}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            ) : null}
        </article>
    );
}

function ReasoningCard(props) {
    return <StepEntry {...props} />;
}

function ToolResultCard(props) {
    return <StepEntry {...props} />;
}

function isStepLike(kind) {
    return kind !== 'user' && kind !== 'assistant';
}

export function AgentRailMessages({
    logs,
    locale,
    getRailMessageKind,
    getLogRoleLabel,
    buildArtifactTags,
    buildLocalePath,
    previewLabel,
    openLabel
}) {
    const visibleLogs = logs.filter(shouldRenderLogEntry);

    return visibleLogs.map((entry, index) => {
        const kind = getRailMessageKind(entry);
        const roleLabel = getLogRoleLabel(entry, locale);
        const isLastStep = isStepLike(kind)
            ? !visibleLogs.slice(index + 1).some((next) => isStepLike(getRailMessageKind(next)))
            : false;
        const showRoundDate = index === 0 || entry.role === 'user';

        let content = null;
        if (kind === 'user') {
            content = <UserBubble key={entry.id} entry={entry} locale={locale} roleLabel={roleLabel} />;
        } else if (kind === 'assistant') {
            content = <AssistantBubble key={entry.id} entry={entry} locale={locale} roleLabel={roleLabel} />;
        } else if (kind === 'tool' || kind === 'result') {
            content = (
                <ToolResultCard
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    kind={kind}
                    isLastStep={isLastStep}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            );
        } else {
            content = (
                <ReasoningCard
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    kind={kind}
                    isLastStep={isLastStep}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            );
        }

        return (
            <div className="rail-round-group" key={entry.id}>
                {showRoundDate ? (
                    <div className="rail-round-separator">
                        <span>{formatRoundDate(entry.createdAt, locale)}</span>
                    </div>
                ) : null}
                {content}
            </div>
        );
    });
}

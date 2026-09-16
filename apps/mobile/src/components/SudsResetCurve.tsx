/**
 * SudsResetCurve
 *
 * A native react-native-svg based interactive SUDS visualisation.
 *
 * DESIGN SPEC:
 *  - X-axis: time (sessions / steps). Y-axis: SUDS rating 0–10.
 *  - Rising phase: sine arc from 0 → peak (initial rating)
 *  - Recovery phase: sine arc from peak → current follow-up rating
 *  - Color zones: CALM(0-3) green, RISING(3-6) yellow, HIGH(6-8) orange, CRISIS(8-10) red
 *  - Draggable thumb on the active endpoint only
 *  - Labels: BEFORE (initial) + NOW (follow-up) markers when both present
 */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop, Text as SvgText, Rect } from 'react-native-svg';
import { colors, spacing, typography, fontSizes, radii } from '../constants/tokens';

// ─── Constants ────────────────────────────────────────────────────────────────
const GRAPH_HEIGHT = 180;
const GRAPH_PADDING_V = 24;  // vertical padding inside SVG
const GRAPH_PADDING_H = 40;  // horizontal padding inside SVG
const SUDS_MAX = 10;
const SUDS_MIN = 0;
const THUMB_RADIUS = 14;

// ─── Zone color helpers ────────────────────────────────────────────────────────
function zoneColor(rating: number): string {
    if (rating < 3) return colors.calmGreen;
    if (rating < 6) return colors.risingYellow;
    if (rating < 8) return colors.highOrange;
    return colors.crisisRed;
}

function zoneLabel(rating: number): string {
    if (rating < 3) return 'CALM';
    if (rating < 6) return 'RISING';
    if (rating < 8) return 'HIGH';
    return 'CRISIS';
}

// ─── Sine arc path builder ─────────────────────────────────────────────────────
/**
 * Builds an SVG path for a smooth sine-eased arc from (x0, y0) to (x1, y1).
 * Uses a cubic bezier that emulates the sine ease curve:
 *   control points at 30% and 70% of the horizontal distance, with full vertical travel.
 */
function buildSineArcPath(
    x0: number, y0: number,
    x1: number, y1: number
): string {
    const dx = x1 - x0;
    const cp1x = x0 + dx * 0.35;
    const cp1y = y0;
    const cp2x = x0 + dx * 0.65;
    const cp2y = y1;
    return `M ${x0} ${y0} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x1} ${y1}`;
}

// ─── Y coordinate mapping ─────────────────────────────────────────────────────
function ratingToY(rating: number, svgHeight: number): number {
    const usableHeight = svgHeight - GRAPH_PADDING_V * 2;
    // Higher rating = higher on screen = lower Y value
    return GRAPH_PADDING_V + usableHeight * (1 - rating / SUDS_MAX);
}

function xFractionToRating(xFraction: number): number {
    // xFraction 0..1 maps to Y value
    // We actually want to map y position to rating (via PanResponder)
    return xFraction;
}

function yToRating(yPosition: number, svgHeight: number): number {
    const usableHeight = svgHeight - GRAPH_PADDING_V * 2;
    const fraction = 1 - (yPosition - GRAPH_PADDING_V) / usableHeight;
    const rating = fraction * SUDS_MAX;
    return Math.max(SUDS_MIN, Math.min(SUDS_MAX, Math.round(rating * 2) / 2));
}

// ─── Zone band paths ──────────────────────────────────────────────────────────
function buildZoneBands(svgWidth: number, svgHeight: number) {
    const zones = [
        { min: 0, max: 3, color: colors.calmGreen },
        { min: 3, max: 6, color: colors.risingYellow },
        { min: 6, max: 8, color: colors.highOrange },
        { min: 8, max: 10, color: colors.crisisRed },
    ];

    return zones.map(zone => {
        const yTop = ratingToY(zone.max, svgHeight);
        const yBottom = ratingToY(zone.min, svgHeight);
        return { ...zone, y: yTop, height: yBottom - yTop };
    });
}

// ─── Component Props ──────────────────────────────────────────────────────────
interface SudsResetCurveProps {
    /** Current value being interacted with */
    value: number;
    /** Callback to update value */
    onValueChange: (v: number) => void;
    /** Optional: The initial check-in rating (for follow-up view) */
    initialRating?: number;
    /** Optional: Width override. Default fills parent. */
    width?: number;
    /** Show before/now labels (follow-up mode) */
    followUpMode?: boolean;
}

export function SudsResetCurve({
    value,
    onValueChange,
    initialRating,
    width: externalWidth,
    followUpMode = false,
}: SudsResetCurveProps) {
    const [containerWidth, setContainerWidth] = React.useState(externalWidth ?? 300);
    const svgWidth = containerWidth;
    const svgHeight = GRAPH_HEIGHT;

    const usableWidth = svgWidth - GRAPH_PADDING_H * 2;

    // X positions
    const x0 = GRAPH_PADDING_H;                    // start (SUDS = 0)
    const xMid = GRAPH_PADDING_H + usableWidth * 0.45;  // peak
    const xEnd = GRAPH_PADDING_H + usableWidth;    // end (current)

    // Y positions
    const yBaseline = ratingToY(0, svgHeight);
    const yPeak = ratingToY(initialRating ?? value, svgHeight);
    const yEnd = ratingToY(value, svgHeight);
    const yZero = ratingToY(0, svgHeight);

    // The active arc
    let risePath: string;
    let fallPath: string | null = null;

    if (followUpMode && initialRating !== undefined) {
        // Two-segment: rise to peak, then fall/rise to current
        risePath = buildSineArcPath(x0, yZero, xMid, yPeak);
        fallPath = buildSineArcPath(xMid, yPeak, xEnd, yEnd);
    } else {
        // Single-segment: rise from 0 to current value
        risePath = buildSineArcPath(x0, yZero, xEnd, yEnd);
    }

    const activeColor = zoneColor(value);
    const thumbX = followUpMode ? xEnd : xEnd;
    const thumbY = yEnd;

    // Zone bands
    const zoneBands = buildZoneBands(svgWidth, svgHeight);

    // ─── PanResponder for dragging thumb ──────────────────────────────────────
    const panResponder = React.useMemo(() => {
        let svgTop = 0;
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const newRating = yToRating(evt.nativeEvent.locationY, svgHeight);
                onValueChange(newRating);
            },
            onPanResponderMove: (evt) => {
                const newRating = yToRating(evt.nativeEvent.locationY, svgHeight);
                onValueChange(newRating);
            },
        });
    }, [svgHeight, onValueChange]);

    const zoneName = zoneLabel(value);
    const color = zoneColor(value);

    return (
        <View style={styles.wrapper}>
            <View
                style={styles.svgContainer}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                {...panResponder.panHandlers}
            >
                <Svg width={svgWidth} height={svgHeight}>
                    <Defs>
                        {/* Gradient for the curve fill */}
                        <LinearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={activeColor} stopOpacity="0.25" />
                            <Stop offset="1" stopColor={activeColor} stopOpacity="0.02" />
                        </LinearGradient>
                    </Defs>

                    {/* Zone bands (subtle horizontal stripes) */}
                    {zoneBands.map((band, i) => (
                        <Rect
                            key={i}
                            x={GRAPH_PADDING_H}
                            y={band.y}
                            width={usableWidth}
                            height={band.height}
                            fill={band.color}
                            opacity={0.06}
                        />
                    ))}

                    {/* Baseline and top line */}
                    <Line
                        x1={GRAPH_PADDING_H} y1={yBaseline}
                        x2={GRAPH_PADDING_H + usableWidth} y2={yBaseline}
                        stroke={colors.softBorder} strokeWidth={1}
                    />

                    {/* Y axis labels (0, 5, 10) */}
                    {[0, 5, 10].map(tick => (
                        <SvgText
                            key={tick}
                            x={GRAPH_PADDING_H - 8}
                            y={ratingToY(tick, svgHeight) + 4}
                            fontSize={10}
                            fill={colors.secondaryText}
                            textAnchor="end"
                            fontFamily="Manrope-Regular"
                        >
                            {tick}
                        </SvgText>
                    ))}

                    {/* Area fill under the rise curve */}
                    <Path
                        d={`${risePath} L ${followUpMode && initialRating !== undefined ? xMid : xEnd} ${yBaseline} L ${x0} ${yBaseline} Z`}
                        fill="url(#curveGradient)"
                    />

                    {/* Main rise curve stroke */}
                    <Path
                        d={risePath}
                        fill="none"
                        stroke={followUpMode ? colors.secondaryText : activeColor}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                    />

                    {/* Fall/recovery curve (follow-up mode only) */}
                    {followUpMode && fallPath && (
                        <>
                            <Path
                                d={`${fallPath} L ${xEnd} ${yBaseline} L ${xMid} ${yBaseline} Z`}
                                fill="url(#curveGradient)"
                            />
                            <Path
                                d={fallPath}
                                fill="none"
                                stroke={activeColor}
                                strokeWidth={2.5}
                                strokeLinecap="round"
                            />
                        </>
                    )}

                    {/* Initial rating marker dot (follow-up mode) */}
                    {followUpMode && (
                        <>
                            <Circle cx={xMid} cy={yPeak} r={5} fill={colors.secondaryText} opacity={0.5} />
                            <SvgText
                                x={xMid}
                                y={yPeak - 12}
                                fontSize={10}
                                fill={colors.secondaryText}
                                textAnchor="middle"
                                fontFamily="Manrope-Bold"
                            >
                                BEFORE
                            </SvgText>
                        </>
                    )}

                    {/* Active thumb */}
                    <Circle
                        cx={thumbX}
                        cy={thumbY}
                        r={THUMB_RADIUS}
                        fill={activeColor}
                        stroke={colors.white}
                        strokeWidth={3}
                    />
                    <SvgText
                        x={thumbX}
                        y={thumbY + 5}
                        fontSize={11}
                        fill={colors.white}
                        textAnchor="middle"
                        fontFamily="Manrope-Bold"
                    >
                        {value}
                    </SvgText>

                    {followUpMode && (
                        <SvgText
                            x={thumbX}
                            y={thumbY - THUMB_RADIUS - 6}
                            fontSize={10}
                            fill={activeColor}
                            textAnchor="middle"
                            fontFamily="Manrope-Bold"
                        >
                            NOW
                        </SvgText>
                    )}
                </Svg>
            </View>

            {/* Zone label + value display */}
            <View style={[styles.statusRow, { borderTopColor: color }]}>
                <View style={[styles.zonePill, { backgroundColor: color + '22', borderColor: color }]}>
                    <Text style={[styles.zoneName, { color }]}>{zoneName}</Text>
                </View>
                <Text style={styles.sudsNumber}>{value}</Text>
                <Text style={styles.sudsCaption}>/ 10</Text>
            </View>

            {/* Step buttons */}
            <View style={styles.stepRow}>
                <View style={styles.stepButtons}>
                    {[0.5, 1].map(step => (
                        <React.Fragment key={`minus-${step}`}>
                            <View style={styles.stepButton} onTouchEnd={() => onValueChange(Math.max(0, Math.round((value - step) * 2) / 2))}>
                                <Text style={styles.stepButtonText}>−{step}</Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>
                <Text style={styles.stepHint}>Drag the dot or tap ±</Text>
                <View style={styles.stepButtons}>
                    {[1, 0.5].map(step => (
                        <React.Fragment key={`plus-${step}`}>
                            <View style={styles.stepButton} onTouchEnd={() => onValueChange(Math.min(10, Math.round((value + step) * 2) / 2))}>
                                <Text style={styles.stepButtonText}>+{step}</Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    svgContainer: {
        width: '100%',
        height: GRAPH_HEIGHT,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        gap: spacing.sm,
        borderTopWidth: 2,
    },
    zonePill: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xxs,
        borderRadius: radii.full,
        borderWidth: 1,
    },
    zoneName: {
        ...typography.sansBold,
        fontSize: fontSizes.xs,
        letterSpacing: 1.5,
    },
    sudsNumber: {
        ...typography.serifBold,
        fontSize: fontSizes['4xl'],
        color: colors.primaryText,
        marginLeft: 'auto',
    },
    sudsCaption: {
        ...typography.sans,
        fontSize: fontSizes.sm,
        color: colors.secondaryText,
        alignSelf: 'flex-end',
        paddingBottom: 6,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
    },
    stepButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    stepButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radii.button,
        borderWidth: 1.5,
        borderColor: colors.softBorder,
        backgroundColor: colors.white,
        minWidth: 44,
        alignItems: 'center',
    },
    stepButtonText: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.sm,
        color: colors.primaryText,
    },
    stepHint: {
        ...typography.sans,
        fontSize: fontSizes.xs,
        color: colors.secondaryText,
    },
});

import React from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop, Text as SvgText, Rect } from 'react-native-svg';
import { colors, spacing, typography, fontSizes, radii } from '../constants/tokens';
import { SUDS_MIN, SUDS_MAX, SUDS_STEP, SUDS_ZONE_COLORS, getSudsCategory } from '@config/sudsConfig';

// ─── Constants ────────────────────────────────────────────────────────────────
const GRAPH_HEIGHT = 180;
const GRAPH_PADDING_V = 24;  // vertical padding inside SVG
const GRAPH_PADDING_H = 40;  // horizontal padding inside SVG
const THUMB_RADIUS = 14;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function zoneColor(rating: number): string {
    return SUDS_ZONE_COLORS[getSudsCategory(rating)];
}

function ratingToY(rating: number, svgHeight: number): number {
    const usableHeight = svgHeight - GRAPH_PADDING_V * 2;
    // SUDS maps 0 to 10 where 10 is highest (lowest Y value)
    return GRAPH_PADDING_V + usableHeight * (1 - rating / SUDS_MAX);
}

function yToRating(yPosition: number, svgHeight: number): number {
    const usableHeight = svgHeight - GRAPH_PADDING_V * 2;
    const fraction = 1 - (yPosition - GRAPH_PADDING_V) / usableHeight;
    const rating = fraction * SUDS_MAX;
    return Math.max(SUDS_MIN, Math.min(SUDS_MAX, Math.round(rating / SUDS_STEP) * SUDS_STEP));
}

// Map rating to X position strictly along a 0->Pi sine wave (y = 10 * sin(x))
function getCurveCoordinates(rating: number, side: 'RISING' | 'RECOVERY', x0: number, usableWidth: number, svgHeight: number) {
    const r = Math.max(0, Math.min(SUDS_MAX, rating)); // Clamp to valid math domain
    const thetaBase = Math.asin(r / SUDS_MAX); // 0 to Pi/2
    const theta = side === 'RISING' ? thetaBase : Math.PI - thetaBase;
    const x = x0 + (theta / Math.PI) * usableWidth;
    const y = ratingToY(r, svgHeight);
    return { x, y };
}

// ─── Component Props ──────────────────────────────────────────────────────────
interface SudsResetCurveProps {
    value: number;
    onValueChange: (v: number) => void;
    initialRating?: number;
    width?: number;
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
    const x0 = GRAPH_PADDING_H;
    const yZero = ratingToY(0, svgHeight);

    // Build the full complete curve path mathematically
    const NUM_POINTS = 50;
    let completeCurvePath = '';
    let fillCurvePath = '';
    for (let i = 0; i <= NUM_POINTS; i++) {
        const fraction = i / NUM_POINTS;
        const theta = fraction * Math.PI;
        const curveRating = Math.sin(theta) * SUDS_MAX;
        const x = x0 + fraction * usableWidth;
        const y = ratingToY(curveRating, svgHeight);

        if (i === 0) {
            completeCurvePath = `M ${x} ${y}`;
            fillCurvePath = `M ${x} ${yZero} L ${x} ${y}`;
        } else {
            completeCurvePath += ` L ${x} ${y}`;
            fillCurvePath += ` L ${x} ${y}`;
        }
    }
    fillCurvePath += ` L ${x0 + usableWidth} ${yZero} Z`; // close the fill area

    // Zone bands
    const zones = [
        { min: 0, max: 3, color: colors.calmGreen },
        { min: 3, max: 6, color: colors.risingYellow },
        { min: 6, max: 8, color: colors.highOrange },
        { min: 8, max: 10, color: colors.crisisRed },
    ];
    const zoneBands = zones.map(zone => {
        const yTop = ratingToY(zone.max, svgHeight);
        const yBottom = ratingToY(zone.min, svgHeight);
        return { ...zone, y: yTop, height: yBottom - yTop };
    });

    // Active thumb coordinates
    const side = followUpMode ? 'RECOVERY' : 'RISING';
    const thumbCoords = getCurveCoordinates(value, side, x0, usableWidth, svgHeight);
    const activeColor = zoneColor(value);

    // BEFORE marker (only in followUpMode)
    let beforeCoords = null;
    if (followUpMode && initialRating !== undefined) {
        beforeCoords = getCurveCoordinates(initialRating, 'RISING', x0, usableWidth, svgHeight);
    }

    // Interactive dragging mapping vertical Y location exactly to SUDS_STEP snapped values
    const panResponder = React.useMemo(() => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                onValueChange(yToRating(evt.nativeEvent.locationY, svgHeight));
            },
            onPanResponderMove: (evt) => {
                onValueChange(yToRating(evt.nativeEvent.locationY, svgHeight));
            },
        });
    }, [svgHeight, onValueChange]);

    const zoneName = getSudsCategory(value);

    return (
        <View style={styles.wrapper}>
            <View
                style={styles.svgContainer}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                {...panResponder.panHandlers}
            >
                <Svg width={svgWidth} height={svgHeight}>
                    <Defs>
                        <LinearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={colors.deepNavy} stopOpacity="0.1" />
                            <Stop offset="1" stopColor={colors.deepNavy} stopOpacity="0.0" />
                        </LinearGradient>
                    </Defs>

                    {/* Zone bands (subtle restrained colors) */}
                    {zoneBands.map((band, i) => (
                        <Rect
                            key={i}
                            x={GRAPH_PADDING_H}
                            y={band.y}
                            width={usableWidth}
                            height={band.height}
                            fill={band.color}
                            opacity={0.08}
                        />
                    ))}

                    {/* Baseline */}
                    <Line
                        x1={GRAPH_PADDING_H} y1={yZero}
                        x2={GRAPH_PADDING_H + usableWidth} y2={yZero}
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

                    {/* Area fill under the complete curve */}
                    <Path
                        d={fillCurvePath}
                        fill="url(#curveGradient)"
                    />

                    {/* Main full curve stroke (deep navy as requested) */}
                    <Path
                        d={completeCurvePath}
                        fill="none"
                        stroke={colors.deepNavy}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        opacity={0.9}
                    />

                    {/* BEFORE marker (Follow-up mode only) */}
                    {beforeCoords && (
                        <>
                            <Circle cx={beforeCoords.x} cy={beforeCoords.y} r={6} fill={colors.deepNavy} opacity={0.6} />
                            <SvgText
                                x={beforeCoords.x - 12}
                                y={beforeCoords.y - 12}
                                fontSize={10}
                                fill={colors.deepNavy}
                                textAnchor="middle"
                                fontFamily="Manrope-Bold"
                                opacity={0.8}
                            >
                                BEFORE
                            </SvgText>
                            <SvgText
                                x={beforeCoords.x}
                                y={beforeCoords.y + 4}
                                fontSize={10}
                                fill={colors.white}
                                textAnchor="middle"
                                fontFamily="Manrope-Bold"
                            >
                                {initialRating}
                            </SvgText>
                        </>
                    )}

                    {/* Active Thumb (YOU ARE HERE or NOW) */}
                    <Circle
                        cx={thumbCoords.x}
                        cy={thumbCoords.y}
                        r={THUMB_RADIUS}
                        fill={activeColor}
                        stroke={colors.white}
                        strokeWidth={3}
                    />
                    <SvgText
                        x={thumbCoords.x}
                        y={thumbCoords.y + 4}
                        fontSize={11}
                        fill={colors.white}
                        textAnchor="middle"
                        fontFamily="Manrope-Bold"
                    >
                        {formatValue(value)}
                    </SvgText>

                    {/* Label floating above the thumb */}
                    <SvgText
                        x={thumbCoords.x}
                        y={thumbCoords.y - THUMB_RADIUS - 8}
                        fontSize={10}
                        fill={activeColor}
                        textAnchor="middle"
                        fontFamily="Manrope-Bold"
                        letterSpacing={0.5}
                    >
                        {followUpMode ? 'NOW' : 'YOU ARE HERE'}
                    </SvgText>
                </Svg>
            </View>

            {/* Step buttons (made secondary to dragging) */}
            <View style={styles.stepRow}>
                <View style={styles.stepButtons}>
                    <View style={styles.stepButton} onTouchEnd={() => onValueChange(Math.max(SUDS_MIN, Math.round((value - SUDS_STEP) * 2) / 2))}>
                        <Text style={styles.stepButtonText}>−0.5</Text>
                    </View>
                </View>
                <Text style={styles.stepHint}>Drag along the curve</Text>
                <View style={styles.stepButtons}>
                    <View style={styles.stepButton} onTouchEnd={() => onValueChange(Math.min(SUDS_MAX, Math.round((value + SUDS_STEP) * 2) / 2))}>
                        <Text style={styles.stepButtonText}>+0.5</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

// ─── Format helper to fix 0.5 rendering natively ──────────────────────────────
function formatValue(v: number) {
    return v === 10 ? '10' : v.toString();
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    svgContainer: {
        width: '100%',
        height: GRAPH_HEIGHT,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xs,
        paddingBottom: spacing.lg,
    },
    stepButtons: {
        flexDirection: 'row',
    },
    stepButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radii.button,
        borderWidth: 1.5,
        borderColor: colors.softBorder,
        backgroundColor: colors.transparent,
        minWidth: 48,
        alignItems: 'center',
    },
    stepButtonText: {
        ...typography.sansSemiBold,
        fontSize: fontSizes.xs,
        color: colors.secondaryText,
    },
    stepHint: {
        ...typography.sans,
        fontSize: fontSizes.xs,
        color: colors.secondaryText,
    },
});

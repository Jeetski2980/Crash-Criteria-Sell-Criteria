SPY Buy & Sell Model — Full Explanation

Purpose:
This document explains a rule-based TradingView script that generates BUY and SELL signals for SPY (S&P 500 ETF) using technical indicators and market behavior. The model includes a crash-detection BUY signal and a post-rebound SELL signal.
<img width="1914" height="900" alt="spy-signals png" src="https://github.com/user-attachments/assets/171af3cf-66c6-438b-96ae-5b6fafe5bbf1" />

 Buy Signal (Crash Detector)

This signal is based on four classic crash indicators. It aims to detect panic-driven selloffs and identify potential market bottoms where a rebound may follow.

Conditions:

SPY drops at least 6% from its 12-bar high

At least one daily drop ≥ 3% in the last 12 bars

At least two daily drops ≥ 1.75% in the last 14 bars

Volume spike: 14-bar average volume ≥ 1.15× 30-bar average

These conditions detect fear and panic-based selling in high-volume environments — a common sign of capitulation or crash events.

 Sell Signal (Euphoric Rebound Detector)

This signal detects overextended rallies following major rebounds. It attempts to exit positions near euphoric tops, after the market has made a sustained and aggressive run.

Strict Sell Conditions:

SPY rebounded ≥ 6% from its 20-bar low

At least one daily gain ≥ 3% in last 15 bars

At least one daily gain ≥ 1.75% in last 10 bars

SPY is ≥ 8% above its 12-week low (60 bars)

SPY has broken its 100-week high (500-bar high)

These criteria confirm strong rallies, euphoric buying, and new highs — the classic signs of short-term topping behavior.

 Adaptive Sell Logic & Real Example
 Adaptive Sell Rule Relaxation

To avoid selling too early after a crash, the SELL model has adaptive thresholds that relax under certain conditions.

Relaxed rules activate only if:

80 bars have passed since the 52-week low

A daily drop of ≥ -1.75% occurs (which toggles relaxed mode ON or OFF)

 Relaxed Sell Conditions:

SPY rebounded ≥ 2.7% from 20-bar low

At least one daily gain ≥ 1.20% in last 15 bars

At least one daily gain ≥ 0.85% in last 10 bars

SPY is ≥ 4.5% above its 12-week low

SPY is within 3.75% of the 100-week high (doesn’t need to break it)

This mode is ideal for post-crash markets where rallies are strong but volatile, and we want to exit closer to the peak without demanding a full breakout.

 Real Examples:

• June 20, 2025 –  SELL Signal
SPY broke its 100-week high after rebounding more than 6%. It had recent daily gains ≥ 3% and ≥ 1.75%, and was far above its recent low. This confirmed euphoric momentum and triggered a SELL.

• February 6, 2025 –  No SELL
The market was rising, but SPY had not broken the 100-week high. The signal remained inactive to avoid false exits during early recovery.

 Visualization & Alerts
Visual Indicators on Chart

This model plots triangle markers with labels when signals are triggered:

 Green Triangle below bar
Label: "BUY"
Meaning: A crash-style event has occurred; potential bottom.
Strategy: Start watching for entry opportunities.

Red Triangle above bar
Label: "SELL"
Meaning: Euphoric breakout confirmed; potential short-term top.
Strategy: Consider locking profits or tightening stops.

 Alerts

The script includes alert conditions for both signals:

"BUY Signal" → When all 4 crash rules are met

"SELL Signal" → When all rebound rules (strict or relaxed) are met

Use these alerts on daily SPY charts to get real-time notifications during crashes or rallies.

Notes

These signals are not perfect — they highlight zones of statistical interest based on historical market behavior.

The BUY signal helps identify panic bottoms. The SELL signal focuses on euphoric tops.

This model is best used in conjunction with broader analysis and not as a stand-alone trading system.

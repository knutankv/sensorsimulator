/* ===========================================================================
   ACCELEROMETER LIBRARY
   ---------------------------------------------------------------------------
   Loaded by a plain <script> tag, so it works from file:// as well as over
   http. To add an instrument, copy a block below, give it a unique "id", and
   fill in whatever its data sheet states — every field is optional, and any
   field you leave out simply keeps the value currently in the app.

   Each field name carries its unit. The simulator reads these names directly.

   NOISE
     noiseDensity_ug_per_rtHz   Spectral noise density, as quoted on the data
                                sheet. This value is only valid inside the
                                spec band below.
     specBandFrom_Hz            Lower end of the band where that density is
     specBandTo_Hz              valid. Upper end.
     riseBelowBand_dB_per_decade
                                How fast the density grows below the spec band
                                (flicker / 1-f noise). 10 dB/decade = 1/f
                                power-law, which is typical for MEMS; 20 for
                                charge-amplifier front ends.
     riseBelowBand_cap_x        Ceiling on that growth, as a multiple of the
                                quoted density, so it cannot rise forever.
     densityAboveBand_x         Density above the spec band, as a multiple of
                                the quoted value. 1 = unchanged.

   SYSTEMATIC ERRORS
     offsetBias_mg              Fixed zero offset.
     biasDrift_mg_rms           Slow random-walk wander of that offset.
     scaleFactorError_percent   Gain error on the measured amplitude.

   RANGE AND DIGITISATION
     measuringRange_g           Full-scale range; the signal clips beyond it.
     adcResolution_bits         Bits across the full range.

   FREQUENCY RESPONSE
     bandwidth_Hz               Corner of the 2-pole low-pass roll-off.
     groupTimeDelay_ms          A true time shift; its phase error grows
                                linearly with frequency.
     constantPhaseOffset_deg    The same phase error at every frequency, so
                                not a time shift.

   LOW-FREQUENCY LIMIT (the source of low-frequency phase error, atan(1/wt))
     lowFrequencyMode           "none"   DC-coupled: no low-frequency limit.
                                "fit"    Estimate the time constant from the
                                         two amplitude-error points below.
                                "manual" Use timeConstant_s as given.
     timeConstant_s             Used when the mode is "manual".
     gainErrorPoint1_dB         First amplitude-error point from the data
     gainErrorPoint1_at_Hz      sheet, e.g. -3 dB at 0.1 Hz.
     gainErrorPoint2_percent    Second point, expressed in percent,
     gainErrorPoint2_at_Hz      e.g. -10 % at 0.5 Hz.
   =========================================================================== */

window.SENSORS = {
  sensors: [

    /* Phone-class MEMS: cheap, noisy, DC-capable. */
    {
      id: "consumer",
      label: "MEMS consumer (phone)",
      description: "Low-cost capacitive MEMS as found in phones and wearables. Responds down to DC, but the noise floor and bias drift are far too high for displacement work.",

      noiseDensity_ug_per_rtHz: 200,
      specBandFrom_Hz: 1,
      specBandTo_Hz: 100,
      riseBelowBand_dB_per_decade: 10,
      riseBelowBand_cap_x: 40,
      densityAboveBand_x: 1,

      offsetBias_mg: 20,
      biasDrift_mg_rms: 0.5,
      scaleFactorError_percent: 1.5,

      measuringRange_g: 8,
      adcResolution_bits: 12,

      bandwidth_Hz: 200,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "none",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* Industrial MEMS: the usual choice for structural monitoring. */
    {
      id: "industrial",
      label: "MEMS industrial",
      description: "Industrial-grade MEMS for machine and structural monitoring. DC-coupled with a wide bandwidth and a moderate noise floor.",

      noiseDensity_ug_per_rtHz: 25,
      specBandFrom_Hz: 1,
      specBandTo_Hz: 500,
      riseBelowBand_dB_per_decade: 10,
      riseBelowBand_cap_x: 40,
      densityAboveBand_x: 1,

      offsetBias_mg: 5,
      biasDrift_mg_rms: 0.05,
      scaleFactorError_percent: 0.5,

      measuringRange_g: 16,
      adcResolution_bits: 16,

      bandwidth_Hz: 1000,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "none",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* Piezoelectric IEPE: quiet and wideband, but blind to DC. */
    {
      id: "iepe",
      label: "Piezoelectric IEPE",
      description: "Charge-mode piezoelectric accelerometer with IEPE conditioning. Very low noise and very wide bandwidth, but AC-coupled: the charge amplifier sets a low-frequency limit, which is where its phase error comes from. The two amplitude-error points below are the usual way a data sheet states it.",

      noiseDensity_ug_per_rtHz: 5,
      specBandFrom_Hz: 2,
      specBandTo_Hz: 2000,
      riseBelowBand_dB_per_decade: 20,
      riseBelowBand_cap_x: 200,
      densityAboveBand_x: 1,

      offsetBias_mg: 0.2,
      biasDrift_mg_rms: 0.01,
      scaleFactorError_percent: 0.3,

      measuringRange_g: 50,
      adcResolution_bits: 24,

      bandwidth_Hz: 5000,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "fit",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* Force-balance servo: the reference instrument for slow motion. */
    {
      id: "servo",
      label: "Force-balance servo",
      description: "Closed-loop force-balance accelerometer. Extremely low noise and drift over a narrow range, DC-coupled — the instrument to reach for when displacement must be recovered by integration.",

      noiseDensity_ug_per_rtHz: 0.5,
      specBandFrom_Hz: 0.1,
      specBandTo_Hz: 100,
      riseBelowBand_dB_per_decade: 10,
      riseBelowBand_cap_x: 20,
      densityAboveBand_x: 1,

      offsetBias_mg: 1,
      biasDrift_mg_rms: 0.005,
      scaleFactorError_percent: 0.05,

      measuringRange_g: 2,
      adcResolution_bits: 24,

      bandwidth_Hz: 300,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "none",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* Seismic-class: built for very slow, very small motion. */
    {
      id: "seismic",
      label: "Low-frequency seismic",
      description: "Seismic-grade sensor for very low frequencies and very small amplitudes. Quiet far below 1 Hz, but AC-coupled, so amplitude and phase error grow quickly as the excitation approaches its corner.",

      noiseDensity_ug_per_rtHz: 1,
      specBandFrom_Hz: 0.05,
      specBandTo_Hz: 50,
      riseBelowBand_dB_per_decade: 15,
      riseBelowBand_cap_x: 60,
      densityAboveBand_x: 1,

      offsetBias_mg: 0.5,
      biasDrift_mg_rms: 0.002,
      scaleFactorError_percent: 0.2,

      measuringRange_g: 1,
      adcResolution_bits: 24,

      bandwidth_Hz: 100,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "fit",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* ---- Real instruments -------------------------------------------------
       Figures below are taken from the manufacturers' published data. Where a
       data sheet is silent (bias drift, scale-factor error, ADC bits given
       only as a dynamic range), a representative value is used and noted. */

    /* Dewesoft IOLITEi/IOLITEicw 3xMEMS-ACC-8g
       dewesoft.com/products/iolitei-3xmems */
    {
      id: "iolite_3xmems",
      label: "Dewesoft IOLITE 3xMEMS-ACC (8 g)",
      description: "Triaxial MEMS with integrated ADC and EtherCAT, built for permanent structural monitoring. 25 µg/√Hz, flat DC–1000 Hz (−3 dB), 4 kS/s, 96 dB dynamic range (≈16 bits). DC response, so displacement by double integration is viable. Bias drift and scale error are representative, not data-sheet values.",

      noiseDensity_ug_per_rtHz: 25,
      specBandFrom_Hz: 1,
      specBandTo_Hz: 1000,
      riseBelowBand_dB_per_decade: 10,
      riseBelowBand_cap_x: 40,
      densityAboveBand_x: 1,

      offsetBias_mg: 5,
      biasDrift_mg_rms: 0.05,
      scaleFactorError_percent: 0.5,

      measuringRange_g: 8,
      adcResolution_bits: 16,

      bandwidth_Hz: 1000,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "none",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* Dewesoft IOLITEicw 3xMEMS-ACC-S — ultra-low-noise version */
    {
      id: "iolite_3xmems_s",
      label: "Dewesoft IOLITE 3xMEMS-ACC-S (low noise)",
      description: "Ultra-low-noise version of the same device: 0.7 µg/√Hz, 2 µg RMS residual noise in a 100 Hz band, ±15 g, 0–460 Hz bandwidth, 1 kS/s, 137 dB dynamic range (≈23 bits). Comparable to force-balance instruments while keeping DC response — the best case in this app for recovering displacement.",

      noiseDensity_ug_per_rtHz: 0.7,
      specBandFrom_Hz: 0.5,
      specBandTo_Hz: 460,
      riseBelowBand_dB_per_decade: 10,
      riseBelowBand_cap_x: 40,
      densityAboveBand_x: 1,

      offsetBias_mg: 1,
      biasDrift_mg_rms: 0.01,
      scaleFactorError_percent: 0.3,

      measuringRange_g: 15,
      adcResolution_bits: 23,

      bandwidth_Hz: 460,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "none",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.1,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 0.5
    },

    /* HBK MicroStrain G-Link-200, ±8 g configuration
       hbkworld.com … /wireless-nodes/g-link-200 */
    {
      id: "glink200",
      label: "HBK MicroStrain G-Link-200 (8 g)",
      description: "Battery-powered wireless triaxial node, IP67, LXRS lossless radio with ±50 µs sync. 25 µg/√Hz in the ±2/±4/±8 g setting (80 µg/√Hz in the ±10–40 g setting), 0 g offset ±25 mg, offset vs temperature ±0.1 mg/°C typical, sampling to 4096 S/s with user-configurable low- and high-pass filters. Left DC-coupled here; enable the high-pass to model its filter. ADC bits and bias drift are representative.",

      noiseDensity_ug_per_rtHz: 25,
      specBandFrom_Hz: 1,
      specBandTo_Hz: 500,
      riseBelowBand_dB_per_decade: 10,
      riseBelowBand_cap_x: 40,
      densityAboveBand_x: 1,

      offsetBias_mg: 25,
      biasDrift_mg_rms: 0.1,
      scaleFactorError_percent: 0.5,

      measuringRange_g: 8,
      adcResolution_bits: 16,

      bandwidth_Hz: 500,
      groupTimeDelay_ms: 0,
      constantPhaseOffset_deg: 0,

      lowFrequencyMode: "none",
      timeConstant_s: 1.6,
      gainErrorPoint1_dB: -3,
      gainErrorPoint1_at_Hz: 0.62,
      gainErrorPoint2_percent: -10,
      gainErrorPoint2_at_Hz: 2.48
    }

  ]
};

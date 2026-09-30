# Production research architecture

## Data contracts

Input tensor: `[initialization, member, lead_time, level, latitude, longitude, variable]`. Record valid time, pressure level, units, grid CRS, missing-value mask, model cycle and provenance. Use Xarray and Dask with GRIB2/NetCDF readers; validate forecast accumulation windows before converting precipitation rates. Split by complete events, initialization dates and years before computing normalization statistics. Do not randomly split neighboring pixels or consecutive frames across train and test.

Use authorized NEPS-G/NCUM archives and paired regional targets from an appropriately licensed high-resolution analysis. ERA5 and IMDAA support climatological context but require resolution and bias assessment. Operational EFI normally uses forecast-model climate; a 30-year reanalysis baseline alone is not a calibrated substitute.

## Stage 1: spherical anomaly tracking

Map normalized multivariable fields onto a refined icosahedral mesh. A message-passing GNN learns spatial and temporal features. Derive EFI separately from calibrated ensemble and climate distributions; feed EFI and physical variables into region segmentation. Associate regions over lead times using geographic overlap, motion and feature similarity. Outputs should include persistent event IDs, geodesic centroids, per-time footprint polygons, variable-wise extremes, ensemble agreement and uncertainty. Handle polar geometry and antimeridian wrapping explicitly.

Loss candidates: event segmentation, centroid displacement, temporal association and tail-weighted amplitude error. Benchmark against threshold-based connected components and nearest-neighbor association. GNN sophistication alone is not evidence of superiority.

## Stage 2: conditional downscaling

Condition a denoising diffusion model on cropped forecast fields, elevation, land-sea mask, lead time and relevant atmospheric variables. Train with matched fine-resolution targets and noise-prediction loss. Sample multiple local realizations rather than reporting one deterministic high-resolution field. Downscale only detected regions to limit computation. Preserve coarse-scale consistency using an explicit aggregation operator aligned to cell areas; 12 km and 5 km grids are not integer subdivisions.

Physical penalties must respect variable units, scale and discretization. Candidate diagnostics include nonnegative precipitation, moisture budget residuals, divergence consistency and surface energy balance when all required fluxes are available. A penalty does not guarantee conservation; measure residuals on held-out events and report them.

## Evaluation and deployment gates

1. Establish raw ensemble, bilinear interpolation and statistical downscaling baselines.
2. Evaluate CRPS, Brier score, reliability, interval coverage, tail quantile bias, event probability and spatial overlap.
3. Track centroid displacement and identity continuity across 3–10 day lead times.
4. Report performance by event type, region, season and lead time; retain uncertainty intervals.
5. Measure runtime, GPU memory, failure modes and calibration drift on the actual serving infrastructure.
6. Require meteorologist review, dataset permission and documented warning thresholds before connecting delivery channels.

The delivered application implements the visualization, deterministic scientific demo, API and exports. It does not claim the research gates above have been met.

## Primary references

- NCMRWF, 12 km NEPS forecast products: https://www.ncmrwf.gov.in/Reports-eng/TR_12-km_NEPS_Forecast_Products.pdf
- ECMWF, EFI user guide: https://confluence.ecmwf.int/spaces/FUG/pages/673551296/Section+8.1.9.2+Extreme+Forecast+Index+-+EFI
- GraphCast: https://arxiv.org/abs/2212.12794
- GenCast: https://arxiv.org/abs/2312.15796
- Natural Earth boundary dataset: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

The problem statement is user-supplied; proposed capabilities therein are requirements and research goals, not verified measurements of this build.

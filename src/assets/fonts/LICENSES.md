# Bundled Font Sources And Licenses

The application bundles only font files whose upstream distribution permits inclusion in this repository. Proprietary platform fonts are referenced with CSS `local(...)` and are not copied into the project.

## Alibaba Sans

- Files: `AlibabaSans-Regular.otf`, `AlibabaSans-Bold.otf`
- Upstream: [Alibaba Fonts](https://www.alibabafonts.com/)
- Asset source: `https://cdn.dancf.com/fonts/AlibabaSans-Normal/`
- Use is subject to the Alibaba Fonts terms published by the upstream provider.

## Source Han Sans And Source Han Serif

- Files: `SourceHanSansSC-Regular.woff`, `SourceHanSansSC-Bold.woff`, `SourceHanSerifSC-Regular.woff`, `SourceHanSerifSC-Bold.woff`
- Upstream: [Source Han Sans](https://github.com/adobe-fonts/source-han-sans) and [Source Han Serif](https://github.com/adobe-fonts/source-han-serif)
- License: [SIL Open Font License 1.1](https://openfontlicense.org/)
- Bold sources: official `release/SubsetOTF/CN` OTF files, subset to preserve all code points supported by the corresponding checked-in Regular WOFF and then encoded as WOFF.
- Standalone HTML fallback: the same official OTFs served through jsDelivr when neither a bundled relative asset nor a matching local face is available.

## Platform Fonts

`PingFang SC` and `Times New Roman` are not bundled. Their real Semibold/Bold faces are loaded from the operating system when available. Source Han Sans Bold and Source Han Serif Bold are the respective redistributable fallbacks.

# Gallery Aspect Ratios & Cropping Guidelines

## Standardized Dimensions

| Container Archetype | Aspect Ratio | Desktop Size | Corner Radius Rules | Typical Content |
|---|---|---|---|---|
| **Vaulted Hero Arch** | `~3:5` | `300px × 520px` | `rounded-t-full` (`9999px 9999px 0 0`) | Signature editorial hair portrait |
| **Featured Big Card** | `4:3` (Landscape) | `h-[210px]` (`col-span-4`) | Sculpted `8px 25px 8px 8px` or `8px 8px 25px 8px` | Full transformation or bridal editorial |
| **Regular Editorial Card** | `~4:3.5` | `h-[195px]` (`col-span-3`) | Standard `8px` or single `25px` corner | Balayage, silk waves, chignon updo |
| **Small Accent Card** | `~3:4` (Portrait) | `h-[180px]` (`col-span-2`) | Standard `8px` or single `25px` corner | Dewy glass skin close-up, nail couture |
| **Before / After Split** | `1:1` or `4:5` | Responsive fill | Standard `12px` | Skin therapy, hair color transformations |

## Overlay Gradient Specs
When text appears over photography:
- Use a directional gradient: `bg-gradient-to-t from-black/85 via-black/40 to-transparent`.
- Ensure text is pure warm white `#fcf8f4` with text shadow `drop-shadow(0 2px 4px rgba(0,0,0,0.4))`.
- Place titles in `Playfair Display` italic with subtitle in `Plus Jakarta Sans` uppercase `10px`.

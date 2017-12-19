using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;

namespace AlloyTemplates.Models.Blocks
{
    [ContentType(DisplayName = "Three Key Facts", GUID = "ce581aa7-8c20-4084-bd2c-7e3e292fc314", Description = "Example of OPE overlays in react")]
    public class ThreeKeyFactsBlock : BlockData
    {
        [Required]
        [Display(
            Name = "First fact",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 1)]
        [UIHint(UIHint.Textarea)]
        public virtual string FirstFact { get; set; }

        [Required]
        [Display(
            Name = "Second fact",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 2)]
        [UIHint(UIHint.Textarea)]
        public virtual string SecondFact { get; set; }

        [Required]
        [Display(
            Name = "Third fact",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 3)]
        [UIHint(UIHint.Textarea)]
        public virtual string ThirdFact { get; set; }

        [Required]
        [Display(
            Name = "Bonus content",
            Description = "Displayed when there are no more facts to display",
            GroupName = SystemTabNames.Content,
            Order = 4)]
        [UIHint(UIHint.Textarea)]
        public virtual string BonusContent { get; set; }
    }
}

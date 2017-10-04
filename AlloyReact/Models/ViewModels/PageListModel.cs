using System.Collections.Generic;
using System.Linq;
using AlloyReact.Business;
using AlloyReact.Controllers;
using AlloyReact.Helpers;
using EPiServer.Core;
using AlloyReact.Models.Blocks;
using AlloyReact.Models.Pages;
using EPiServer;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;

namespace AlloyReact.Models.ViewModels
{
    public class PageListModel
    {
        private Injected<ContentLocator> _contentLocator;
        private Injected<IContentLoader> _contentLoader;

        private List<PageData> _pages = new List<PageData>();

        public PageListModel(PageListBlock block)
        {
            Heading = block.Heading;
            IncludeIntroduction = block.IncludeIntroduction;
            IncludePublishDate = block.IncludePublishDate;

            // Content link is either for an independent block, or for content with a property of type PageListBlock
            ContentLink = block is IContent ? ((IContent)block).ContentLink : ServiceLocator.Current.GetInstance<IPageRouteHelper>().ContentLink;

            Pages = new PageListBlockController(_contentLocator.Service, _contentLoader.Service).FindPages(block);
        }

        public string Heading { get; set; }

        public IEnumerable<dynamic> Pages
        {
            get { return _pages.Select(p => new { name = p.Name, description = (p as SitePageData)?.TeaserText, date = p.StartPublish?.ToShortDateString(), cssClass = p.GetThemeCssClassNames(), url = UrlResolver.Current.GetUrl(p) }); }
            set => _pages = ((IEnumerable<PageData>)value).ToList();
        }

        public bool IncludeIntroduction { get; set; }

        public bool IncludePublishDate { get; set; }

        public ContentReference ContentLink { get; protected set; }
    }
}

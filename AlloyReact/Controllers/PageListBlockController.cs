using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using EPiServer.Core;
using EPiServer.Filters;
using EPiServer.Web.Mvc;
using EPiServer;
using EPiServer.Web.Routing;
using AlloyReact.Helpers;
using AlloyReact.Models.Pages;
using AlloyReact.Business;
using AlloyReact.Models.Blocks;

namespace AlloyReact.Controllers
{
    public class PageListBlockController : BlockController<PageListBlock>
    {
        private ContentLocator contentLocator;
        private IContentLoader contentLoader;

        public PageListBlockController(ContentLocator contentLocator, IContentLoader contentLoader)
        {
            this.contentLocator = contentLocator;
            this.contentLoader = contentLoader;
        }

        public override ActionResult Index(PageListBlock currentBlock)
        {
            return PartialView("/Views/Shared/DisplayTemplates/PageListBlock.cshtml", currentBlock);
        }

        public IEnumerable<PageData> FindPages(PageListBlock currentBlock)
        {
            IEnumerable<PageData> pages;
            var listRoot = currentBlock.Root;
            if (currentBlock.Recursive)
            {
                if (currentBlock.PageTypeFilter != null)
                {
                    pages = contentLocator.FindPagesByPageType(listRoot, true, currentBlock.PageTypeFilter.ID);
                }
                else
                {
                    pages = contentLocator.GetAll<PageData>(listRoot);
                }
            }
            else
            {
                if (currentBlock.PageTypeFilter != null)
                {
                    pages = contentLoader.GetChildren<PageData>(listRoot)
                        .Where(p => p.ContentTypeID == currentBlock.PageTypeFilter.ID);
                }
                else
                {
                    pages = contentLoader.GetChildren<PageData>(listRoot);
                }
            }

            if (currentBlock.CategoryFilter != null && currentBlock.CategoryFilter.Any())
            {
                pages = pages.Where(x => x.Category.Intersect(currentBlock.CategoryFilter).Any());
            }

            var asCollection = new PageDataCollection(pages);
            var sortFilter = new FilterSort(currentBlock.SortOrder);
            sortFilter.Sort(asCollection);
            pages = asCollection;

            if (currentBlock.Count > 0)
            {
                pages = pages.Take(currentBlock.Count);
            }

            return pages;
        }

        /// <summary>
        /// Endpoint returning pages for a specific list block
        /// </summary>
        /// <param name="contentLink"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public JsonResult Pages(ContentReference contentLink, string propertyName)
        {
            // HACK Currently property name is forced to camel-case in serialization, convert back to Pascal case
            propertyName = $"{propertyName.Substring(0, 1).ToUpper()}{propertyName.Substring(1)}";

            var content = contentLoader.Get<IContent>(contentLink);

            var pageListBlock = content as PageListBlock ?? (PageListBlock)content.Property[propertyName].Value;

            var pages = FindPages(pageListBlock);

            return Json(pages.OfType<SitePageData>().Select(p =>
                new
                {
                    name = p.Name,
                    description = p.TeaserText,
                    date = p.StartPublish?.ToShortDateString(),
                    url = UrlResolver.Current.GetUrl(p),
                    cssClass = p.GetThemeCssClassNames()
                }),
                JsonRequestBehavior.AllowGet);
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Xml.Serialization;

namespace WixossSimulator.SugarSync
{
    /// <summary> https://www.sugarsync.com/dev/api/ws-list-resource.html </summary>
    [XmlRoot("collectionContents")]
    public class WorkspacesCollectionResource
    {
        public class WorkspacesCollection
        {
            /// <summary> The type of the collection (workspace). </summary>
            [XmlAttribute("type")]
            public string collectionType { get; set; }

            /// <summary> The user-visible name of the workspace. </summary>
            [XmlElement("displayName")]
            public string DisplayName { get; set; }

            /// <summary> A link to the workspace. </summary>
            [XmlElement("ref")]
            public string ReferenceUrl { get; set; }

            /// <summary> 
            /// The identifier of the icon associated with the workspace resource. 
            /// Note that the actual icons that are associated with SugarSync workspaces are not available through the Platform API. 
            /// </summary>
            [XmlElement("iconId")]
            public long IconId { get; set; }

            /// <summary> A link to the contents of the workspace. The contents of a workspace are the sync folders that are mapped to that workspace in SugarSync. </summary>
            [XmlElement("contents")]
            public string ContentsUrl { get; set; }
        }

        [XmlAttribute("end")]
        public long End { get; set; }

        [XmlAttribute("hasMore")]
        public bool HasMore { get; set; }

        [XmlAttribute("start")]
        public long Start { get; set; }

        [XmlElement("collection")]
        public List<WorkspacesCollection> Collection { get; set; }
    }
}